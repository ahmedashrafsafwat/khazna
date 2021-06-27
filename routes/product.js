const routes = require("express").Router();
// const mysql = require('mysql2/promise');
// const config = require('../config/dbconfig');
// const bridge = require('../services/bridge')
const uuid = require('uuid')
const productController = require('../controller/product_controller')
const { successResponse, errorResponse, uniqueId } = require('../helper');

const errorHandler = require('../middlewares/errorHandler').default;
/**
 * @swagger
 * article/all:
 *   get:
 *     summary: Get all articles
 *     description: Retrieve a list of articles with the number of likes on each article, as well as the author details, sorted by the number of likes.
 *     responses:
 *       404:
 *         description: An error occurs of not found when no article is found
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  description: empty array
 *                  example: []
 *       200:
 *         description: A list of all articles.
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             data:
 *               type: array
 *               description: list of articles ordered descendingly 
 *               items:
 *                     type: object
 *                     properties:
 *                       article_id:
 *                         type: string
 *                         description: The article ID.
 *                         example: ef220005-1330-4d4c-9f5d-6c2d087844f1
 *                       title:
 *                         type: string
 *                         description: The article's title.
 *                         example: nodejs tutorial
 *                       body:
 *                         type: string
 *                         description: The article's body.
 *                         example: this an article body
 *                       author_id:
 *                         type: string
 *                         description: The author's id.
 *                         example: 4bc9fe96-324f-436f-b64e-9808e3d499ef
 *                       name:
 *                         type: string
 *                         description: The author's name.
 *                         example: Mike
 *                       job_title:
 *                         type: string
 *                         description: The author's job title.
 *                         example: Developer
 *                       likes:
 *                         type: integer
 *                         description: The number of likes on this article.
 *                         example: 10
*/
routes.get("/userproducts", async (req, res,next) => {
 // check for errors
 req.assert("id", "user id can't be empty").notEmpty();

 const errors = req.validationErrors();

 // return validation errors
 if (errors) {
   return errorHandler(errors,req,res,next)
 }

 productController.getUserProducts(req,res);
});

/**
 * @swagger
 * article/add:
 *   post:
 *     summary: add new article
 *     description: Adding new article with validation on feilds sent in the body paramters returns added successfully or an insert error or missing sent data error.
 *     parameters:
 *      - in: body
 *        name: title
 *        type: string
 *        required: true
 *        description: the title of the article it must be less than 50 chars
 *      - in: body
 *        name: body
 *        type: string
 *        required: true
 *        description: the body of the article it must be less than 8000 char
 *      - in: body
 *        name: author_id
 *        type: string
 *        required: true
 *        description: the author id who wrote the article
 *     responses:
 *       401:
 *         description: An error occurs when the sent paramters are not complete
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: array
 *                  description: list of missing paramters that is required to be sent to the api
 *                  items:
 *                     type: object
 *                     properties:
 *                       location:
 *                         type: string
 *                         description: the missing paramter location.
 *                         example: params
 *                       param:
 *                         type: string
 *                         description: The missing paramter key value.
 *                         example: title
 *                       msg:
 *                         type: string
 *                         description: The error message.
 *                         example: title can't be not empty
 *       200:
 *         description: success message or error message depending whether the article is added or not.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                  type: string
 *                  description: The message of the api.
 *                  example: Added successfully
 *                id:
 *                  type: string
 *                  description: The id of the inserted object.
 *                  example: 836be72d-fcd4-467b-a5c4-e5a4e96dd94c
*/
routes.post("/add", async (req, res,next) => {

  req.assert("name", "Name  can't be empty").notEmpty();
  req.assert("brand", "Email can't be empty").notEmpty();
  req.assert("category", "Password can't be empty").notEmpty();
  req.assert("price","Price can't be empty").notEmpty();
 
  const errors = req.validationErrors();
 
  // return validation errors
  if (errors) {
    return errorHandler(errors,req,res,next)
  }
 
   await productController.add(req,res);
  // return result.success?  successResponse(result.message, result.data,result.code,res):errorResponse( result.message,result.code,{},res);

});




 
module.exports = routes;
