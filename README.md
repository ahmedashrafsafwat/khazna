# Khazna backend Task

## Before running the project you may need to:

please initiate the database and import the dummy data from the `/db_backup` folder:

the `khazna_init.sql` file has all the tables create sql statments, also the rest of the files in that directory insert statments to import some data

These data can be used for testing, it is not fully accurate and some articles may have some empty author_ids that doesn't exist but still it works fine.

##IMOBRTANT:
 If you want to run the application using npm please set in environment variables `.env` file the `USE_DOCKER` key to 0, but if you want to use docker containers then set the value to 1

### To run this project you can run:

1. the following comands

run `npm install`

run `npm run start` or `nodemon start` (if you have nodemon installed in your development enviornment)

then test by heading over to:

   `http://localhost:3000/register`

2. using Docker by running this commands:

   `docker-compose build`

   then

   `docker-compose up`

   then test by heading over to:

   `http://localhost:3000/register`

   or

   `http://localhost:3000/login`

### To run the unit and e2e test cases

`npm run test`

### To have a look at the API documentation

1. please run the application first by running `npm run start`
2. then head over to `http://localhost:3000/api-docs/`


For any questions or issues when running the task please contact me at ahmedashrafsafwat@gmail.com

Looking forward to hear from you