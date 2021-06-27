const { errorResponse } = require('../helper');
const { User } = require( '../models');

const jwt = require('jsonwebtoken');

const apiAuth = async (req, res, next) => {
  if (!(req.headers && req.headers['x-token'])) {
    return errorResponse('Token is not provided', 401,{},res);
  }
  const token = req.headers['x-token'];
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded.user;
    const user = await User.findOne({
      where: { email: req.user.email },
    });
    if (!user) {
      return errorResponse( 'User is not found in system', 401,{},res);
    }
    const reqUser = { ...user.get() };
    reqUser.userId = user.id;
    req.user = reqUser;
    return next();
  } catch (error) {
    return errorResponse(
      'Incorrect token is provided, try re-login',
      401,
      res,

    );
  }
};

module.exports =  apiAuth;