FROM node:18

WORKDIR /workspaces/graphql_examples/tests

RUN export DEBIAN_FRONTEND=noninteractive && apt update && apt -y upgrade

RUN <<EOF cat >> ~/.bashrc

# Shorter prompt (fitting narrow VSCode windows without wrapping)
export PS1="\[\]${debian_chroot:+($debian_chroot)}\u@\h\$ \[\]"
EOF
