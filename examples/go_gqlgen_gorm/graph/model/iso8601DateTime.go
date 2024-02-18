package model

import (
	"encoding"
	"fmt"
	"io"
	"strconv"
	"time"

	"github.com/99designs/gqlgen/graphql"
)

type ISO8601DateTime time.Time

var (
	_ fmt.Stringer             = new(ISO8601DateTime)
	_ encoding.TextUnmarshaler = new(ISO8601DateTime)
	_ graphql.Marshaler        = new(ISO8601DateTime)
	_ graphql.Unmarshaler      = new(ISO8601DateTime)
)

// String implements fmt.Stringer.
func (dt ISO8601DateTime) String() string {
	return time.Time(dt).Format(time.RFC3339Nano)
}

// UnmarshalText implements encoding.TextUnmarshaler.
func (dt *ISO8601DateTime) UnmarshalText(text []byte) error {
	parsed, err := time.Parse(time.RFC3339Nano, string(text))
	if err != nil {
		return fmt.Errorf("error parsing ISO8601DateTime: %v", err)
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
	return fmt.Errorf("error parsing ISO8601DateTime: unexpected value type %T", v)
}

// MarshalGQL implements graphql.Marshaler.
func (dt ISO8601DateTime) MarshalGQL(w io.Writer) {
	w.Write([]byte(strconv.Quote(dt.String())))
}
