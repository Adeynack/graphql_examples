package model

import (
	"errors"
	"fmt"
	"io"
	"strconv"
	"time"
)

type ISO8601DateTime time.Time

var (
	ErrParsingISO8601DateTime           = errors.New("error parsing ISO8601DateTime")
	ErrUnableToUnmarshalISO8601FromType = errors.New("error parsing ISO8601DateTime: value must be string")
)

// String implements fmt.Stringer.
func (dt ISO8601DateTime) String() string {
	return time.Time(dt).Format(time.RFC3339Nano)
}

// UnmarshalText implements encoding.TextUnmarshaler.
func (dt *ISO8601DateTime) UnmarshalText(text []byte) error {
	parsed, err := time.Parse(time.RFC3339Nano, string(text))
	if err != nil {
		return fmt.Errorf("%w: %v", ErrParsingISO8601DateTime, err)
	}
	*dt = ISO8601DateTime(parsed)
	return nil
}

// UnmarshalGQL implements graphql.Unmarshaler.
func (dt *ISO8601DateTime) UnmarshalGQL(v any) error {
	if value, ok := v.(string); ok {
		return dt.UnmarshalText([]byte(value))
	}
	if value, ok := v.([]byte); ok {
		return dt.UnmarshalText(value)
	}
	return fmt.Errorf("%w, got %T", ErrUnableToUnmarshalISO8601FromType, v)
}

// MarshalGQL implements graphql.Marshaler.
func (dt ISO8601DateTime) MarshalGQL(w io.Writer) {
	w.Write([]byte(strconv.Quote(dt.String())))
}
