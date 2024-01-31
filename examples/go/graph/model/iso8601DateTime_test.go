package model

import (
	"bytes"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func Test_Marshal_DateWithSecondFraction(t *testing.T) {
	timeValue, err := time.Parse(time.RFC3339, "2022-06-14T19:06:43.123000Z")
	assert.NoError(t, err)
	writer := new(bytes.Buffer)
	ISO8601DateTime(timeValue).MarshalGQL(writer)
	assert.Equal(t, "2022-06-14T19:06:43.123Z", writer.String())
}

func Test_Unmarshal_NotAString(t *testing.T) {
	var value ISO8601DateTime
	err := value.UnmarshalGQL(12345)
	if assert.Error(t, err) {
		assert.Equal(t, err.Error(), "error parsing ISO8601DateTime: value must be an array of bytes")
	}
}

func Test_Unmarshal_EmptyString(t *testing.T) {
	var value ISO8601DateTime
	err := value.UnmarshalGQL("")
	if assert.Error(t, err) {
		assert.Contains(t, err.Error(), "error parsing ISO8601DateTime")
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
