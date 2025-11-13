#!/bin/bash

cd "$(dirname "$0")/.."

# install nvm (Node Version Manager):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

. ~/.nvm/nvm.sh

# install Node.js version 24 and set it as the default:
nvm install 24
nvm use 24

# build vscode extension package
npm install -y
npm run package
