# Confusion Server
* This is an API developed during the course of Coursera NodeJS Course
* It serves various resources over a REST API persisted on MongoDB Database
* User authentication is present using JWT Tokens, however implementation of session based authentication is also present in previous commits
* Admin user has to be set manually using Mongo REPL

## Setup
* .env files are used to provide environment variables, however these are not included in the repository, instead .env.example files are present
* Execute `setup.sh` script to auto rename the .env.example files
* Docker support is also present
* `docker-compose up --build` Only for development configuration

## Known Issue(s)
* Mounting `/mongo_data` to mongo container creates permission issue, only solution is to use `sudo rm -rf ./mongo_data`