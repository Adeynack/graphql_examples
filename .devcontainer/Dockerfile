FROM ruby:3.2

WORKDIR /workspaces/graphql_examples

# Update/Upgrade to latest software, add keys and sources, install software
RUN export DEBIAN_FRONTEND=noninteractive && apt update && apt -y upgrade
RUN apt -y install --no-install-recommends software-properties-common gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && apt -y install --no-install-recommends \
    zsh \
    tmux \
    nodejs \
    postgresql-client \
    libpq-dev \
    default-jre
RUN npm install -g yarn@1
RUN yarn install

# Set zsh as default shell, with oh-my-zsh
RUN chsh --shell /usr/bin/zsh && \
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" && \
    sed -i -e 's/^ZSH_THEME=.*/ZSH_THEME="amuse"/' ~/.zshrc

# Setup tmux
COPY tmux.conf /root/.tmux.conf

