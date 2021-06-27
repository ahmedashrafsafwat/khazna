const express = require("express");
var cors = require("cors");
const session = require("express-session");
const expressValidator = require("express-validator");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
var swaggerJSON = require("../swagger.json");
var passport = require('passport');


// configurations ===============================================================
// Load environment variables from .env file
dotenv.config({
    path: ".env"
});

require('../config/passport')(passport); // pass passport for configuration


// connect to db
require('../models');


// swagger jsdoc
const specs = swaggerJsdoc(swaggerJSON);

// services configs
const services = require('../config/services')

/**
 * Function used to generate an express server for a service and returns the express server factory object
 * serviceName {String} the name of the server
 * port {Number} the port that the server should be initialized at
 * isGateway {Boolean}  to identify if we need also to start the gateway redirecting functions
 */
ServerGenerator = (serviceName, port, isGateway) => {
    // Create express server
    let app = express();


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(expressValidator());

    // add swagger UI API documentations through this route
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(specs)
    );

    // required for passport
    app.use(session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true
    })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions

    app.listen(port, () => {
        console.log(`${serviceName} service is running at http://localhost:${port} in ${ app.get("env")} mode`);
    });

    if (isGateway) {
        apiRouting(app)
    }

    return app;
}

apiRouting = (app) => {
    let routeNames = services.map(x => x.path);
    let routesURI = []

    // example routesURI = ['/user*', '/request*', '/product*']
    routeNames.forEach(path => {
        routesURI.push(`/${path}*`)
    })

    /** redirect all get requests */
    app.get(
        routesURI,
        function (req, res) {
            var serviceName = req.originalUrl.split('/')[1]
            serviceRedirects(serviceName, routeNames, req, res)
        }
    );

    /** redirect all post requests */
    app.post(
        routesURI,
        function (req, res) {
            var serviceName = req.originalUrl.split('/')[1]
            serviceRedirects(serviceName, routeNames, req, res)
        }
    );
}


serviceRedirects = (serviceName, routeNames, req, res) => {
    if (routeNames.indexOf(serviceName) > -1) {
        services.forEach(service => {
            if (service.path == serviceName)
                res.redirect(307, `http://${req.hostname}:${service.port}${req.originalUrl}`);
        })
    } else {
        res.json({
            error: 'Service not found'
        });
        return;
    }
}

module.exports = ServerGenerator;