const routes = require("express").Router();
// const mysql = require('mysql2/promise');
// const config = require('../config/dbconfig');
// const bridge = require('../services/bridge')
const uuid = require('uuid')
const requestController = require('../controller/request_controller')

const errorHandler = require('../middlewares/errorHandler').default;

/**
 * @swagger
 * tags:
 *  name: Requests
 *  description: All user product requests APIs
*/

/**
 * @swagger
 * request/makerequest:
 *   post:
 *     summary: request a product by the user's id
 *     tags: [Requests]
 *     description: allows users to request a product and can be detucted from his balance
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             code:
 *               type: number
 *               description: the api response code as agreed within the team (may be different than the response code)
 *               example: 200
 *             message:
 *               type: string
 *               description: the return message can be used in flash messages
 *               example: Request made
 *             success:
 *               type: boolean   
 *               description: if true then the user's request should do as the user expected
 *               example: true
 *             data:
 *               type: object
 *               description: has the user's data and his auth token 
 *               properties:
 *                   id:
 *                     type: string
 *                     description: The successfull request's id.
 *                     example: 4bc9fe96-324f-436f-b64e-9808e3d499ef
 *                   userid:
 *                     type: string
 *                     description: The user's id.
 *                     example: 4bc9fe96-324f-436f-b64e-9808e3d499ef
 *                   productid:
 *                     type: string
 *                     description: The product's id.
 *                     example: 4bc9fe96-324f-436f-b64e-9808e3d499ef
 *                   status:
 *                     type: string
 *                     description: The request's status.
 *                     example: new
 *                   price:
 *                     type: number
 *                     description: The request's cost.
 *                     example: 30
*/
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

/**
 * @swagger
 * request/cancel:
 *   post:
 *     summary: cancel an on going request 
 *     tags: [Requests]
 *     description: allows users to cancel an own made request if it's status not canceled or delivered for example
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             code:
 *               type: number
 *               description: the api response code as agreed within the team (may be different than the response code)
 *               example: 200
 *             message:
 *               type: string
 *               description: the return message can be used in flash messages
 *               example: Request canceled successfully
 *             success:
 *               type: boolean   
 *               description: if true then the user's request should do as the user expected
 *               example: true
 *             data:
 *               type: object
 *               description: has the user's data and his auth token 
 *               properties:
 *                   id:
 *                     type: string
 *                     description: The successfull request's id.
 *                     example: 4bc9fe96-324f-436f-b64e-9808e3d499ef
 *                   userid:
 *                     type: string
 *                     description: The user's id.
 *                     example: 4bc9fe96-324f-436f-b64e-9808e3d499ef
 *                   productid:
 *                     type: string
 *                     description: The product's id.
 *                     example: 4bc9fe96-324f-436f-b64e-9808e3d499ef
 *                   status:
 *                     type: string
 *                     description: The request's status.
 *                     example: canceled
 *                   price:
 *                     type: number
 *                     description: The request's cost.
 *                     example: 30
*/
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