#!/bin/bash

# Exit on error
set -e

# Handle Ctrl+C (SIGINT)
cleanup() {
    cd ..
    echo ""
    echo "Stopping Docker Compose services..."
    docker compose -f ./docker-compose.dev.yml down
    exit 0
}

# Trap Ctrl+C (SIGINT) and call cleanup function
trap cleanup SIGINT

# Step 1: Build and start Docker containers
echo "Starting Docker containers with Docker Compose..."
echo "Waiting for NestJS app to be ready..."

docker compose -f ./docker-compose.dev.yml up --build --remove-orphans -d

# Step 2: Wait for Docker containers to be fully up
echo "Waiting for containers to be up..."
until docker compose -f ./docker-compose.dev.yml exec -T projects-board-service curl -s http://localhost:8080 > /dev/null; do
    echo "Waiting for NestJS app to be available..."
    sleep 10
done

# Step 3: Start the frontend app
echo "Starting the frontend application..."
cd client
yarn start

# Keep the script running to handle Ctrl+C
wait
