# Use the official PostgreSQL image from the Docker Hub
FROM postgres:16

# Add the init.sql script to the Docker image
COPY init.sql /docker-entrypoint-initdb.d/

# Set environment variables for PostgreSQL
ENV POSTGRES_DB=projects-board
ENV POSTGRES_USER=postgress
ENV POSTGRES_PASSWORD=mypassword123!

# To build and run this container run the following commands

# docker build -t projects-board-service-db .
# docker run --name projects-board-service-db -p 5432:5432 -d projects-board-service-db