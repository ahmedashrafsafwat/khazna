const routes = require("express").Router();
// const mysql = require('mysql2/promise');
// const config = require('../config/dbconfig');
// const bridge = require('../services/bridge')
const uuid = require('uuid')
const passport = require("passport");
const { successResponse, errorResponse, uniqueId } = require('../helper');
const errorHandler = require('../middlewares/errorHandler').default;

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: All users APIs
*/


/**
 * @swagger
 * user/login:
 *   post:
 *     summary: user login
 *     tags: [Users]
 *     description: allows users to login and if successfull sends back the user data with their token
 *     responses:
 *       200:
 *         description: A list of all articles.
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
 *               example: User logged in
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
 *                     description: The user's id.
 *                     example: 4bc9fe96-324f-436f-b64e-9808e3d499ef
 *                   email:
 *                     type: string
 *                     description: The user's email.
 *                     example: ahmedashraf@gmail.com
 *                   name:
 *                     type: string
 *                     description: The user's name.
 *                     example: Ahmed Ashraf
 *                   token:
 *                     type: string
 *                     description: The user's valid authtoken.
 *                     example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMTYwMDI2ZjAtZDZkYy0xMWViLWI4YTItZGQ1Y2QyYzFlZDAwIiwiZW1haWwiOiJhc2RAYXNkLmNvbSIsIm5hbWUiOiJ0ZXN0IiwiYmFsYW5jZSI6MjAsIm1heF9iYWxhbmNlIjo1MH0sImlhdCI6MTYyNDc1MjY0MX0.HayqJEAaItPEiwfuN_IDe5tBSySQwVxTy4NwbqpsqkE
 *                   balance:
 *                     type: number
 *                     description: The user's balance.
 *                     example: 30
 *                   max_balance:
 *                     type: number
 *                     description: The user's maximum allowed balance.
 *                     example: 30
*/
routes.post("/login", async (req, res,next) => {
  
  req.assert("email", "Email can't be empty").notEmpty();
  req.assert("password", "Password can't be empty").notEmpty();
  
  const errors = req.validationErrors();

  // return validation errors
  if (errors) {
    return errorHandler(errors,req,res,next)
  }

    // return the results
    passport.authenticate('local-login',(err,user,info)=>{

      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }
      
      return user.success?  successResponse(user.message, user.data,user.code,res):errorResponse( user.message,user.code,{},res);
    })(req, res, next);
});

/**
 * @swagger
 * user/register:
 *   post:
 *     summary: register new user
 *     tags: [Users] 
 *     description: allows users to register using their unique email and some extra data
 *     responses:
 *       200:
 *         description: the success response of user registery.
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
 *               example: User logged in
 *             success:
 *               type: boolean   
 *               description: if true then the user's request should do as the user expected
 *               example: true
*/
routes.post("/register", function(req, res, next) { 

  // check for errors
  req.assert("name", "Name  can't be empty").notEmpty();
  req.assert("email", "Email can't be empty").notEmpty();
  req.assert("password", "Password can't be empty").notEmpty();
  req.assert("email","email must be valid").isEmail();

  const errors = req.validationErrors();

  // return validation errors
  if (errors) {
    return errorHandler(errors,req,res,next)
  }

  passport.authenticate('local-signup',(err,user,info)=>{
  return user.success?  successResponse(user.message, user.data,user.code,res):errorResponse( user.message,user.code,{},res);
})(req, res, next);
})




module.exports = routes;
