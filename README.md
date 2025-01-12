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
