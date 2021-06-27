const app  = require('./server.factory')('Gateway',process.env.NODE_LOCAL_PORT,true);

module.exports = app;