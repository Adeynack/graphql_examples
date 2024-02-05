package service

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"

	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"gorm.io/gorm"
)

const (
	AUTHORIZATION_HEADER     = "Authorization"
	API_SESSION_TOKEN_COOKIE = "api-session-token"
)

type ctxSessionKeyType string

var (
	ctxSessionKey       = ctxSessionKeyType("session")
	ctxAuthCookieSetter = ctxSessionKeyType("auth-cookie-setter")
)

func AuthenticationMiddleware(db *gorm.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Register the auth cookie setter.
			r = r.WithContext(context.WithValue(r.Context(), ctxAuthCookieSetter, func(token string) {
				updateTokenCookie(w, token)
			}))

			var session *model.ApiSession
			if token, goOn := extractToken(w, r); !goOn {
				return
			} else if token != "" {
				session = tryAuthenticateWithToken(w, r, db, token)
				if session == nil {
					return
				}
				r = r.WithContext(context.WithValue(r.Context(), ctxSessionKey, session))
			}

			next.ServeHTTP(w, r)
		})
	}
}

func extractToken(w http.ResponseWriter, r *http.Request) (string, bool) {
	// First try to get token from headers (eg: API usage).
	token := r.Header.Get(AUTHORIZATION_HEADER)
	if token != "" {
		var hadPrefix bool
		if token, hadPrefix = strings.CutPrefix(token, "Bearer "); hadPrefix {
			return token, true
		}
		failFromInvalidToken(w, r)
		return "", false
	}

	// Alternatively, try in the cookies (eg: GraphiQL web session).
	cookie, err := r.Cookie(API_SESSION_TOKEN_COOKIE)
	if err == nil {
		return cookie.Value, true
	}

	// No token found anywhere.
	return "", true
}

// authenticateUserFromToken validates the session against the token and
// returns if the user was authenticated (false = do not continue).
func authenticateUserFromToken(db *gorm.DB, token string) (*model.ApiSession, error) {
	// Retrieve session.
	session := &model.ApiSession{Token: token}
	err := db.Where(session).Preload("User").First(session).Error
	if err == nil {
		return session, nil // session found, no error.
	}
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil // no session found, but no error.
	}
	return nil, err // unxpected error.
}

// tryAuthenticateWithToken returns the updated request, or `nil` if the middle chain should stop.
func tryAuthenticateWithToken(w http.ResponseWriter, r *http.Request, db *gorm.DB, token string) *model.ApiSession {
	session, err := authenticateUserFromToken(db, token)

	// Error? Log error and fail without content.
	if err != nil {
		log.Printf("error while obtaining user's session: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return nil
	}

	// No session found for token? Fail and stop.
	if session == nil {
		failFromInvalidToken(w, r)
		return nil
	}

	return session
}

func deleteTokenCookie(w http.ResponseWriter, r *http.Request) {
	_, err := r.Cookie(API_SESSION_TOKEN_COOKIE)
	if err == nil {
		http.SetCookie(w, &http.Cookie{Name: API_SESSION_TOKEN_COOKIE, MaxAge: -1})
	}
}

func failFromInvalidToken(w http.ResponseWriter, r *http.Request) {
	deleteTokenCookie(w, r)

	// Delete the Authorization header
	w.Header().Del(AUTHORIZATION_HEADER)

	// Respond with a JSON error.
	jsonError := model.JsonError{
		Status: http.StatusUnauthorized,
		Errors: []model.JsonErrorError{
			{Message: "Invalid bearer token"},
		},
	}
	content, err := json.Marshal(jsonError)
	if err != nil {
		content = []byte(jsonError.Errors[0].Message)
	}
	http.Error(w, string(content), int(jsonError.Status))
}

func updateTokenCookie(w http.ResponseWriter, token string) {
	authCookie := &http.Cookie{
		Name:  API_SESSION_TOKEN_COOKIE,
		Value: token,
	}
	if token == "" {
		authCookie.MaxAge = -1
	}
	http.SetCookie(w, authCookie)
}
