package graph

import (
	"errors"
	"fmt"
)

type UserFacingErrorWrapper struct {
	err error
}

func (e UserFacingErrorWrapper) Error() string {
	return e.err.Error()
}

func UserFacingError(text string) *UserFacingErrorWrapper {
	return &UserFacingErrorWrapper{errors.New(text)}
}

func UserFacingErrorf(format string, a ...any) *UserFacingErrorWrapper {
	return &UserFacingErrorWrapper{fmt.Errorf(format, a...)}
}
