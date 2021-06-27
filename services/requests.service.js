const apiAuth = require("../middlewares/apiAuth")
const requestRouter = require("../routes/request");

const app = require('./server.factory')('Requests', process.env.REQUEST_SERVICE_PORT);

app.use("/request", apiAuth, requestRouter);