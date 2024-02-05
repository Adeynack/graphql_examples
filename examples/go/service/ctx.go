package service

import (
	"context"

	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"gorm.io/gorm"
)

// ReqCtx (Request Context) provides all elements needed
// during the run of a request/query.
type ReqCtx struct {
	Context     context.Context
	DB          *gorm.DB
	ServerSalt  string
	ApiSession  *model.ApiSession
	CurrentUser *model.User
}

func (ctx *ReqCtx) ExtractCtxInformation() {
	if session, ok := ctx.Context.Value(ctxSessionKey).(*model.ApiSession); ok {
		ctx.ApiSession = session
		ctx.CurrentUser = session.User
	}
}

func (ctx *ReqCtx) SetTokenCookie(token string) {
	if authCookieSetter, ok := ctx.Context.Value(ctxAuthCookieSetter).(func(token string)); ok {
		authCookieSetter(token)
	}
}
