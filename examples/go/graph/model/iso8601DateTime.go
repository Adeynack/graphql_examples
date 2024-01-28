package model

import (
	"fmt"
	"io"
	"time"
)

type ISO8601DateTime time.Time

func (dt *ISO8601DateTime) UnmarshalGQL(v interface{}) error {
	value, ok := v.(string)
	if !ok {
		return fmt.Errorf("ISO8601DateTime value must be a string")
	}
	parsed, err := time.Parse(time.RFC3339Nano, value)
	if err != nil {
		return fmt.Errorf("error parsing ISO8601DateTime: %v", err)
	}
	*dt = ISO8601DateTime(parsed)
	return nil
}

func (dt ISO8601DateTime) MarshalGQL(w io.Writer) {
	w.Write([]byte(dt.String()))
}

func (dt ISO8601DateTime) String() string {
	return time.Time(dt).Format(time.RFC3339Nano)
}
