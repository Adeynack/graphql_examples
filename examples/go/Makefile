build:
	go build -o bin/goexample ./cmd/goexample/*.go

b: build

clean:
	go clean -cache -testcache

c: clean

test:
	go test ./...

t: test

ct: clean test

lint: build
	go vet ./...
	go run honnef.co/go/tools/cmd/staticcheck@latest ./...

check: clean build lint test
