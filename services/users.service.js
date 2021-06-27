const userRouter = require("../routes/user");

const app = require('./server.factory')('Users', process.env.USER_SERVICE_PORT);

app.use("/user", userRouter);