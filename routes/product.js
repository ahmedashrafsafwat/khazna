const routes = require("express").Router();
// const mysql = require('mysql2/promise');
// const config = require('../config/dbconfig');
// const bridge = require('../services/bridge')
const uuid = require('uuid')
const productController = require('../controller/product_controller')
const {
  successResponse,
  errorResponse,
  uniqueId
} = require('../helper');

const errorHandler = require('../middlewares/errorHandler').default;

routes.get("/userproducts", async (req, res, next) => {
  // check for errors
  req.assert("id", "user id can't be empty").notEmpty();

  const errors = req.validationErrors();

  // return validation errors
  if (errors) {
    return errorHandler(errors, req, res, next)
  }

  productController.getUserProducts(req, res);
});

routes.post("/add", async (req, res, next) => {

  req.assert("name", "Name  can't be empty").notEmpty();
  req.assert("brand", "Email can't be empty").notEmpty();
  req.assert("category", "Password can't be empty").notEmpty();
  req.assert("price", "Price can't be empty").notEmpty();

  const errors = req.validationErrors();

  // return validation errors
  if (errors) {
    return errorHandler(errors, req, res, next)
  }

  await productController.add(req, res);

});





module.exports = routes;