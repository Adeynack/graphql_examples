# Generate code (eg: GraphQL)
gen:
	go generate ./...

gen_watch:
	go tool air -c .air.gen.toml

# Start development server
run:
	go run cmd/server/*.go

dev:
	go tool overmind start -f Procfile.dev -p 30301

# Build binaries
build:
	go build -o bin/server ./cmd/server/*.go

build_watch:
	go tool air -c .air.build.toml

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
	echo "SELECT 'CREATE DATABASE go_development' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'go_development')\gexec" | psql

db_drop:
	echo 'drop database if exists "go_development"' | psql

db_seed:
	go run cmd/seed/*.go -truncate

db_full_reset: db_drop db_init db_seed
