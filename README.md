# Projects Board

## Description

Example board app: NestJS + React

## Installation & start instructions

### Install service dependencies

```bash
$ cd service
$ yarn install
```

### Install client dependencies

```bash
$ cd client
$ yarn install
```

## Run the app via docker

> Please make sure that you have Docker engine started on your machine, you can use Docker Desktop or Colima, the BE service and PostgreSQL instances are started over docker compose.
Make sure that the DB port is not occupied: 5432


```bash
<!-- this should start the BE, DB and client -->
$ ./start.sh

<!-- or start the projects separately -->
$ docker compose -f ./docker-compose.dev.yml up
<!-- once the services started, start the client -->
$ cd client yarn start
```

- The service is running at port: 8080
- The client is runnint at port: 3000
- The Swagger documentation is: http://localhost:8080/api/v1/docs

![Screenshot 2025-01-12 at 13 22 27](https://github.com/user-attachments/assets/7265ac31-6abe-42e2-b481-66db5b20b6b5)

![Screenshot 2025-01-12 at 13 21 58](https://github.com/user-attachments/assets/3fa47ea5-0bd7-47d2-9007-c2321bc09a73)

![Screenshot 2025-01-12 at 13 21 46](https://github.com/user-attachments/assets/d27eeadf-e950-44e0-9f10-3af14e42bb7b)
