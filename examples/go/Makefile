# Generate code (eg: GraphQL)
gen:
	go generate ./...

gen_watch:
	air -c .air.gen.toml

# Start development server
run:
	go run cmd/server/*.go

dev: gen build
	overmind start -f Procfile.dev -p 30301

# Build binaries
build:
	go build -o bin/server ./cmd/server/*.go

build_watch:
	air -c .air.build.toml

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

check: clean gen build lint test

# Database
db_init:
	psql -c 'create database "go_development"'

db_drop:
	psql -c 'drop database "go_development"'

db_seed:
	go run cmd/seed/*.go -truncate

db_full_reset: db_drop db_init db_seed
