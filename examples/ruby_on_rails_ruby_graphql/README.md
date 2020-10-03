# README

## Development Environment

### Service Depeendencies

A _Docker Compose_ file is provided. All required database and other
services are included in.

```bash
docker-compose up
```

### Database Creation

Create and initialize the database for development like this.

```bash
bin/rails db:create db:migrate db:seed db:fixtures:load
```

In a staging or production environment, you want to skip `db:load_fixtures`.

#### Re-Create the Database

A _Rake_ task `db:full_reset` is included and is useful for quickly recreate
the database from scratch to make sure migrations are applied properly. It performa
a full reset of the database, loads seeds & fixtures, and re-annotate the models.
