#!/bin/bash

source .venv/bin/activate

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
else
  echo ".env file not found!"
  exit 1
fi

if [ "$BUILD" = "1" ]; then
  if [ "$COLLECT_STATIC" = "1" ]; then
    python src/manage.py collectstatic --noinput
  fi
  if [ "$MAKE_MIGRATIONS" = "1" ]; then
    python src/manage.py makemigrations --noinput
  fi
  if [ "$MIGRATE" = "1" ]; then
    python src/manage.py migrate --noinput
  fi
  if [ "$BUID_TAILWINDCSS" = "1" ]; then
    cd src/tailwindcss
    npm run build
    cd ../../
  fi
fi
if [ "$PRODUCTION" = "1" ]; then
#   echo "⛔ Production server not implemented yet!"
  gunicorn --bind "0.0.0.0:$APP_PORT" "$APP_NAME.asgi" --log-level info --chdir $APP_NAME -w 4 --worker-connections=1000 --threads 2 -k uvicorn.workers.UvicornWorker
else
  if [ "$CONTAINER" = "1" ]; then
    echo "🐋 running project in container. Visit http://0.0.0.0:8081."
    docker run --name $PROJECT_NAME -p $APP_PORT:8081 -d $DOCKER_USERNAME/$DOCKER_IMAGENAME:latest -v "$APP_DIR/data/static:/usr/src/static" -v "$APP_DIR/src:/usr/src"
  else
    echo "⚠️ Using unsecure debug server."
    python main.py  # programatically uvicorn server
  fi
fi