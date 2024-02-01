FROM golang:1.21

WORKDIR /workspaces/graphql_examples/examples/go

RUN export DEBIAN_FRONTEND=noninteractive && apt update && apt -y upgrade

RUN export DEBIAN_FRONTEND=noninteractive && apt update && apt -y upgrade
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && apt -y install --no-install-recommends \
    postgresql-client \
    pspg \
    tmux

RUN <<EOF cat >> ~/.bashrc

# Shorter prompt (fitting narrow VSCode windows without wrapping)
export PS1="\[\]${debian_chroot:+($debian_chroot)}\u@\h\$ \[\]"

# Default PostgreSQL Connection
# Will automatically connect to the devcontainer's attached PostgreSQL
# database (see "docker-compose.yml") by typing "psql".
export PGHOST=127.0.0.1 PGPORT=30102 PGUSER=postgres
export PAGER=pspg
EOF
