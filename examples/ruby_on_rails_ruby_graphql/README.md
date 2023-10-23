# README

## Creation

This app was created with this command.

```bash
rails new ruby_on_rails_ruby_graphql --database=postgresql
```

## Library Dependencies

### PostgreSQL

PostgreSQL libraries are needed for this to work.

#### Linux

```bash
sudo apt-get install libpq-dev
```

If this is not enough, try also this.

```bash
echo 'deb http://apt.postgresql.org/pub/repos/apt/ stretch-pgdg main' | sudo tee /etc/apt/sources.list.d/pgdg.list
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update && sudo apt install -y postgresql-client-11
```

#### macOS

```bash
brew install postgresql
```

## Database Creation

Create and initialize the database for development like this.

```bash
bin/rails db:create db:migrate db:seed db:fixtures:load
```

In a staging or production environment, you want to skip `db:load_fixtures`.

### Re-Create the Database

A _Rake_ task `db:full_reset` is included and is useful for quickly recreate
the database from scratch to make sure migrations are applied properly. It performa
a full reset of the database, loads seeds & fixtures, and re-annotate the models.

# GraphQL

## Development Notes

Most of the files are generated.

```bash
rails generate graphql:install --playground --graphiqlrails
```
