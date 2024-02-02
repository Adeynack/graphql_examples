package prj

import (
	"context"

	"gorm.io/gorm"
)

// ReqCtx (Request Context) provides all elements needed
// during the run of a request/query.
type ReqCtx struct {
	Context    context.Context
	DB         *gorm.DB
	ServerSalt string
}
