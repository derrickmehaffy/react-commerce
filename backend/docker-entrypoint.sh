#!/bin/sh
set -ea

if [ "$1" = "strapi" ]; then

  if [ ! -f "package.json" ]; then

    echo "No project found at /srv/app!"
    exit 1

  elif [ ! -d "node_modules" ] || [ ! "$(ls -qAL node_modules 2>/dev/null)" ]; then

    echo "Node modules not installed. Installing..."

    if [ -f "yarn.lock" ]; then

      yarn install

    else

      npm install

    fi

  fi

fi

echo "🚀 Starting strapi app..."

exec "$@"