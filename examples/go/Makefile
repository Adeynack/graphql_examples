# Generate code (eg: GraphQL)
gen:
	go generate ./...

g: gen

# Start development server
dev:
	go run cmd/server/main.go

d: dev

# Build binaries
build:
	go build -o bin/server ./cmd/server/*.go

b: build

# Misc

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
