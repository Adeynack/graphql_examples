package model

import (
	"bytes"
	"encoding"
	"fmt"
	"testing"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/stretchr/testify/assert"
)

var ( // Ensure that ISO8601DateTime implements the necessary interfaces.
	_ fmt.Stringer             = (*ISO8601DateTime)(nil)
	_ encoding.TextUnmarshaler = (*ISO8601DateTime)(nil)
	_ graphql.Marshaler        = (*ISO8601DateTime)(nil)
	_ graphql.Unmarshaler      = (*ISO8601DateTime)(nil)
)

func Test_Marshal_DateWithSecondFraction(t *testing.T) {
	timeValue, err := time.Parse(time.RFC3339, "2022-06-14T19:06:43.123000Z")
	assert.NoError(t, err)
	writer := new(bytes.Buffer)
	ISO8601DateTime(timeValue).MarshalGQL(writer)
	assert.Equal(t, `"2022-06-14T19:06:43.123Z"`, writer.String())
}

func Test_Unmarshal_NotAString(t *testing.T) {
	var value ISO8601DateTime
	err := value.UnmarshalGQL(12345)
	if assert.Error(t, err) {
		if assert.ErrorIs(t, err, ErrUnableToUnmarshalISO8601FromType) {
			assert.Equal(t, err.Error(), "error parsing ISO8601DateTime: value must be string, got int")
		}
	}
}

func Test_Unmarshal_EmptyString(t *testing.T) {
	var value ISO8601DateTime
	err := value.UnmarshalGQL("")
	if assert.Error(t, err) {
		if assert.ErrorIs(t, err, ErrParsingISO8601DateTime) {
			assert.Contains(t, err.Error(), "error parsing ISO8601DateTime")
		}
	}
}

func Test_Unmarshal_DateWithSecondFraction(t *testing.T) {
	var value ISO8601DateTime
	err := value.UnmarshalGQL("2022-06-14T19:06:43.123Z")
	if assert.NoError(t, err) {
		dt := time.Time(value)
		assert.Equal(t, 2022, dt.Year())
		assert.Equal(t, time.June, dt.Month())
		assert.Equal(t, 14, dt.Day())
		assert.Equal(t, 19, dt.Hour())
		assert.Equal(t, 6, dt.Minute())
		assert.Equal(t, 43, dt.Second())
		assert.Equal(t, 123_000_000, dt.Nanosecond())
	}
}
