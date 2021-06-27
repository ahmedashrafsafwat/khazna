var app;
const dotenv = require("dotenv");


// configurations ===============================================================
// Load environment variables from .env file
dotenv.config({
    path: ".env"
});

/**
 *  Start loading services
 */
var startServer = function () {
    app = require('./services/gateway.service')
    require('./services/users.service')
    require('./services/products.service')
    require('./services/requests.service')
}


/**
 *  When running through docker mysqldb container needs to be initialized first
 *  so we can't connect to the database using command docker-compose which
 *  runs all containers at the same time, we need to wait till the mysqldb container initializes
 *  which takes about 15 seconds but for making sure it is up we have delayed the connection time to 1 min
 *  - source: https://hub.docker.com/_/mysql/
 *  but if the RUN_DOCKER env variable is not true then connect to the database immeditly 
 */
if (process.env.RUN_DOCKER == 1) {
    setTimeout(() => {
        console.log('starting server')
        startServer()
    }, 20000)
} else {
    startServer()
}



module.exports = app;