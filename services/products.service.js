const apiAuth = require("../middlewares/apiAuth")
const productRouter = require("../routes/product");

const app = require('./server.factory')('Products', process.env.PRODUCT_SERVICE_PORT);

app.use("/product", apiAuth, productRouter);