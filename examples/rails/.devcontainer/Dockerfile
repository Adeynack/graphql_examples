FROM ruby:3.2

WORKDIR /workspaces/graphql_examples/examples/rails

# Update/Upgrade to latest software, add keys and sources, install software
RUN export DEBIAN_FRONTEND=noninteractive && apt update && apt -y upgrade
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && apt -y install --no-install-recommends \
    postgresql-client \
    pspg \
    libpq-dev

RUN <<EOF cat >> ~/.bashrc

# Shorter prompt (fitting narrow VSCode windows without wrapping)
export PS1="\[\]gql-ex/rails\$ \[\]"

# Default PostgreSQL Connection
# Will automatically connect to the devcontainer's attached PostgreSQL
# database (see "docker-compose.yml") by typing "psql".
export PGHOST=127.0.0.1 PGPORT=30002 PGUSER=postgres
export PAGER=pspg
EOF
