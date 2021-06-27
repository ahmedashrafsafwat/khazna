const routes = require("express").Router();
const uuid = require('uuid')
const productController = require('../controller/product_controller')
const {
  successResponse,
  errorResponse,
  uniqueId
} = require('../helper');

const errorHandler = require('../middlewares/errorHandler').default;


/**
 * @swagger
 * tags:
 *  name: Products
 *  description: All user product requests APIs
*/

/**
 * @swagger
 * product/userproducts?id={id}:
 *   get:
 *     summary: gets all products that less than or equal the maximum balance of the user
 *     tags: [Products]
 *     description: allows users to get all products less than or equal the maximum balance of the user
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
 *               type: array
 *               description: has the user's data and his auth token 
 *               items:
 *                 type: object
 *                 properties:
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


/**
 * @swagger
 * product/add:
 *   post:
 *     summary: add a new product
 *     tags: [Products]
 *     description: allows users to add new product
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
 *               example: Products
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
 *                     description: The product's id.
 *                     example: 4bc9fe96-324f-436f-b64e-9808e3d499ef
 *                   name:
 *                     type: string
 *                     description: The product's ma,e.
 *                     example: this a product name
 *                   brand:
 *                     type: string
 *                     description: The product's brand.
 *                     example:  this a product brand
 *                   category:
 *                     type: string
 *                     description: The request's status.
 *                     example:  this a product category
 *                   price:
 *                     type: number
 *                     description: The product's price.
 *                     example: 30
*/
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