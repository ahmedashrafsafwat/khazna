const routes = require("express").Router();
// const mysql = require('mysql2/promise');
// const config = require('../config/dbconfig');
// const bridge = require('../services/bridge')
const uuid = require('uuid')
const passport = require("passport");
const {
  successResponse,
  errorResponse,
  uniqueId
} = require('../helper');
const errorHandler = require('../middlewares/errorHandler').default;


routes.post("/login", async (req, res, next) => {

  req.assert("email", "Email can't be empty").notEmpty();
  req.assert("password", "Password can't be empty").notEmpty();

  const errors = req.validationErrors();

  // return validation errors
  if (errors) {
    return errorHandler(errors, req, res, next)
  }

  // return the results
  passport.authenticate('local-login', (err, user, info) => {

    if (req.body.remember) {
      req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
      req.session.cookie.expires = false;
    }

    return user.success ? successResponse(user.message, user.data, user.code, res) : errorResponse(user.message, user.code, {}, res);
  })(req, res, next);
});

/**
 * @swagger
 * user/add:
 *   post:
 *     summary: add new user
 *     description: Adding new user with validation on feilds sent in the body paramters returns added successfully or an insert error or missing sent data error.
 *     parameters:
 *      - in: body
 *        name: name
 *        type: string
 *        required: true
 *        description: the name of the user it must be less than 50 chars
 *      - in: body
 *        name: job_tile
 *        type: string
 *        required: true
 *        description: the job title of the user it must be less than 50 char
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
 *         description: success message or error message depending whether the user is added or not.
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
routes.post("/register", function (req, res, next) {

  // check for errors
  req.assert("name", "Name  can't be empty").notEmpty();
  req.assert("email", "Email can't be empty").notEmpty();
  req.assert("password", "Password can't be empty").notEmpty();
  req.assert("email", "email must be valid").isEmail();

  const errors = req.validationErrors();

  // return validation errors
  if (errors) {
    return errorHandler(errors, req, res, next)
  }

  passport.authenticate('local-signup', (err, user, info) => {
    return user.success ? successResponse(user.message, user.data, user.code, res) : errorResponse(user.message, user.code, {}, res);
  })(req, res, next);
})



/**
 * @swagger
 * user/getbyid/{id}:
 *   get:
 *     summary: get user by id
 *     description: get user by id sent as query paramter.
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: the id of the user sent as a query paramter
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
 *       404:
 *         description: An error occurs of not found when no user is found
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
 *         description: has list of found article which with id sent in the path url 
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             data:
 *               type: array
 *               description: the found user 
 *               items:
 *                     type: object
 *                     properties:
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
 */
routes.get("/getbyid/:id", async (req, res) => {

  // check for errors
  req.assert("id", "author id  must be not empty").notEmpty();

  const errors = req.validationErrors();

  // return validation errors
  if (errors) {
    return res.status(401).json({
      message: errors
    });
  }

  // save image uri if sent
  const sql = ` select * from  authors where author_id = '${req.params.id}' `


  // return the results
  let users = await bridge.getMultiple(sql, 1);
  users.length > 0 ? res.json(users) : res.status(404).json(users);
});




module.exports = routes;