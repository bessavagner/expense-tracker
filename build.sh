#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
else
    echo ".env file not found!"
    exit 1
fi

if [ "$BUILD" = "1" ]; then
    if [[ "$INSTALL" = "1" ]]; then
        echo "🛠️ Building project: "
        echo "╰─ ⏬ Installing requirements"
        poetry export -f requirements.txt --output requirements.txt
        pip install -r requirements.txt
        echo "╰─ ⏬ Installing requirements: ended!"
    fi
    if [ "$BUILD_DATABASE" = "1" ]; then
        echo "Database setup:"
        echo "  Database: $POSTGRES_DB"
        echo "  User: $POSTGRES_USER"
        echo "  Host: $POSTGRES_HOST"
        echo "  Port: $POSTGRES_PORT"

        # Function to create database
        create_database() {
            echo "Creating database '$POSTGRES_DB'..."
            psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U postgres -c "CREATE DATABASE $POSTGRES_DB;"
        }

        # Function to create user
        create_user() {
            echo "Creating user '$POSTGRES_USER' with password '$POSTGRES_PASSWORD'..."
            psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U postgres -c "CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';"
            psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U postgres -c "ALTER DATABASE $POSTGRES_DB OWNER TO $POSTGRES_USER;"
        }

        # Grant privileges
        grant_privileges() {
            echo "Granting privileges on database '$POSTGRES_DB' to user '$POSTGRES_USER' ..."
            psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;"
            psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U postgres -c "ALTER USER $POSTGRES_USER CREATEDB;"
        }

        # Run functions
        create_database
        create_user
        grant_privileges

        echo "Database setup completed successfully."
    fi
    if [[ "$BUILD_TAILWINDCSS" = "1" ]]; then
        cd src/tailwindcss
        echo "╰─ ⏬ Installing tailwindcss"
        npm install
        echo "╰─ ⏬ Installing tailwindcss: finished!"
        echo "╰─ ⏬ Building tailwind style"
        npm run build
        echo "╰─ ⏬ Building tailwind style: finished"
        cd ../../
    fi
    if [[ "$PRODUCTION" = "1" ]]; then
        echo "🐋 Building Docker image..."
        docker build -t  "$DOCKER_USERNAME"/"$DOCKER_IMAGENAME" .
        echo "🐋 Building Docker image: finished!"
    fi
    echo "🛠️ Building Expense Tracker project: completed!"
    echo "🔑 Secret key generated:"
    python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
fi
