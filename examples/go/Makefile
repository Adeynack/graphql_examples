# Generate code (eg: GraphQL)
gen:
	go generate ./...

# Start development server
dev:
	go run github.com/cosmtrek/air

# Build binaries
build:
	go build -o bin/server ./cmd/server/*.go

# Generate code & build binaries
gen_build: gen build

# Misc

clean:
	go clean -cache -testcache

test:
	go test ./...

ct: clean test

lint: build
	go vet ./...
	go run honnef.co/go/tools/cmd/staticcheck@latest ./...

check: clean build lint test
