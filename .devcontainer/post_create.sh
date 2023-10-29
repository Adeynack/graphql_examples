# This script runs as user `vscode`.
echo "I am $USER, executing in $PWD"

echo Setting ZSH as default shell
sudo chsh --shell /usr/bin/zsh vscode

echo Setting default ZSH theme
sed -i -e 's/^ZSH_THEME=.*/ZSH_THEME="amuse"/' ~/.zshrc

echo "Installing PostgreSQL Development libraries (libpq-dev)"
sudo apt install libpq-dev

echo "Starting PostgreSQL Server"
sudo service postgresql start

echo Installing JS/TS dependencies
yarn install

echo "Launching background initializations --> tmux attach -t Examples"
/workspaces/graphql_examples/examples/start_initial_setup_in_background
