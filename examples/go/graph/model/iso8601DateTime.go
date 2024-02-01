package model

import (
	"encoding"
	"encoding/json"
	"fmt"
	"io"
	"time"

	"github.com/99designs/gqlgen/graphql"
)

type ISO8601DateTime time.Time

var (
	_ graphql.Marshaler        = new(ISO8601DateTime)
	_ graphql.Unmarshaler      = new(ISO8601DateTime)
	_ fmt.Stringer             = new(ISO8601DateTime)
	_ encoding.TextMarshaler   = new(ISO8601DateTime)
	_ encoding.TextUnmarshaler = new(ISO8601DateTime)
	_ json.Unmarshaler         = new(ISO8601DateTime)
)

// UnmarshalGQL implements graphql.Unmarshaler.
func (dt *ISO8601DateTime) UnmarshalGQL(v any) error {
	// TODO: Try removing `UnmarshalGQL` and see if `MarshalText` is enough
	if value, ok := v.(string); ok {
		return dt.UnmarshalText([]byte(value))
	}
	if value, ok := v.([]byte); ok {
		return dt.UnmarshalText(value)
	}
	return fmt.Errorf("error parsing ISO8601DateTime: value must be an array of bytes")
}

// MarshalGQL implements graphql.Marshaler.
func (dt ISO8601DateTime) MarshalGQL(w io.Writer) {
	w.Write([]byte(dt.String()))
}

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

// MarshalText implements encoding.TextMarshaler.
func (dt *ISO8601DateTime) MarshalText() (text []byte, err error) {
	return []byte(dt.String()), nil // TODO: Would `String` be enough?
}

// UnmarshalJSON implements json.Unmarshaler.
func (dt *ISO8601DateTime) UnmarshalJSON(text []byte) error {
	return dt.UnmarshalText(text)
}
