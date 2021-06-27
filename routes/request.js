const routes = require("express").Router();
// const mysql = require('mysql2/promise');
// const config = require('../config/dbconfig');
// const bridge = require('../services/bridge')
const uuid = require('uuid')
const requestController = require('../controller/request_controller')

const errorHandler = require('../middlewares/errorHandler').default;

routes.post("/makerequest", async (req, res, next) => {
  // check for errors
  req.assert("userid", "user id can't be empty").notEmpty();
  req.assert("productid", "product id can't be empty").notEmpty();

  const errors = req.validationErrors();

  // return validation errors
  if (errors) {
    return errorHandler(errors, req, res, next)
  }

  requestController.makeRequest(req, res);
});


routes.post("/cancel", async (req, res, next) => {

  req.assert("requestid", "requestid  can't be empty").notEmpty();
  req.assert("userid", "userid can't be empty").notEmpty();

  const errors = req.validationErrors();

  // return validation errors
  if (errors) {
    return errorHandler(errors, req, res, next)
  }

  await requestController.cancelRequest(req, res);

});





module.exports = routes;