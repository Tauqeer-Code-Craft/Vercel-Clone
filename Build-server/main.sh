#!/bin/bash

export GIT_REPOSITORY_URL="$GIT_REPOSITORY_URL"
# export GIT_REPOSITORY_URL="https://github.com/Tauqeer-Code-Craft/TodoList.git"

git clone "$GIT_REPOSITORY_URL" /home/app/output

exec node script.js 