package service

import (
	"context"
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
			// Register the auth cookie setter in the request's context, so endpoints
			// controllers can use it (eg: GraphQL mutations).
			r = r.WithContext(context.WithValue(r.Context(), ctxAuthCookieSetter, func(token string) {
				updateTokenCookie(w, token)
			}))

			// Extract token and validate session.
			if token, ok := extractToken(w, r); !ok {
				return
			} else if token != "" {
				session, ok := authenticateWithToken(w, r, db, token)
				if !ok {
					return
				}
				// Register the current session in the request's context.
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
	if cookie, err := r.Cookie(API_SESSION_TOKEN_COOKIE); err == nil {
		return cookie.Value, true
	}

	// No token found anywhere.
	return "", true
}

// authenticateUserFromToken validates the session against the token and then
// returns the session and if the user was authenticated (false = response already written).
func authenticateWithToken(w http.ResponseWriter, r *http.Request, db *gorm.DB, token string) (*model.ApiSession, bool) {
	session := &model.ApiSession{Token: token}
	if err := db.Where(session).Preload("User").First(&session).Error; err == nil {
		return session, true
	} else if errors.Is(err, gorm.ErrRecordNotFound) {
		failFromInvalidToken(w, r)
		return session, false
	} else {
		log.Printf("error while obtaining user's session: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return session, false
	}
}

func deleteTokenCookie(w http.ResponseWriter, r *http.Request) {
	_, err := r.Cookie(API_SESSION_TOKEN_COOKIE)
	if err == nil {
		http.SetCookie(w, &http.Cookie{Name: API_SESSION_TOKEN_COOKIE, MaxAge: -1})
	}
}

func failFromInvalidToken(w http.ResponseWriter, r *http.Request) {
	deleteTokenCookie(w, r)
	w.Header().Del(AUTHORIZATION_HEADER)
	respondWithJsonError(w, http.StatusUnauthorized, "Invalid bearer token")
}

// updateTokenCookie sets the cookie containing the authorization token
// or clears it if `token` is an empty string.
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
