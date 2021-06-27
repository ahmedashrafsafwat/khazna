const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const  {User}  = require('../models');
const { successResponse, errorResponse, uniqueId } = require('../helper');
const UUID = require('uuid')

exports.allUsers = async (req, res) => {
  try {
    const page = req.params.page || 1;
    const limit = 2;
    const users = await User.findAndCountAll({
      order: [['createdAt', 'DESC'], ['firstName', 'ASC']],
      offset: (page - 1) * limit,
      limit,
    });
    return successResponse(req, res, { users });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

      const user = await User.findOne({
        where: {email}
      });

      if(!user) {
          throw new Error('User not found!')
      }

    const result = await bcrypt.compare(password,user.password)

    const token = jwt.sign(
        {
          user: {
            id: user.id,
            email: user.email,
            name:user.name,
            balance:user.balance,
            max_balance:user.max_balance
          },
        },
        process.env.SECRET,
      );

      user.dataValues.token = token
    delete user.dataValues.password;

        if (result) {
            return {message:"User logged in",data:user,code :200,success:true}
        } else {
            throw new Error('Wrong Password')
        }

    } catch (error) {
        let message = error.message;
        return {message,success:false}
    }
  };

exports.register = async (req,res) => {
  try {
    const {
      email, password, name, balance, max_balance
    } = req.body;

    const id = UUID.v1();

    const user = await User.findOne({
      where: { email },
    });
    if (user) {
      throw new Error('User already exists with same email');
    }

    // generate hashed password 
    let salt =await bcrypt.genSalt(10)    
    let hash = await bcrypt.hash(password, salt)
    let hashedPassword = hash; 

    const newUser = {
          id,
          email,
          name,
          password:hashedPassword,
          balance,
          max_balance,
        };
        const newReturn = await User.create(newUser);

        return {message:"User registered successfully",data:[],code :200,success:true}


   
  } catch (error) {
      let message = error.message;
      return {message,success:false}
  }
};



exports. profile = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findOne({ where: { id: userId } });
    return successResponse(req, res, { user });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

exports. changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.scope('withSecretColumns').findOne({
      where: { id: userId },
    });

    const reqPass = bcrypt
      .createHash('md5')
      .update(req.body.oldPassword)
      .digest('hex');
    if (reqPass !== user.password) {
      throw new Error('Old password is incorrect');
    }

    const newPass = bcrypt
      .createHash('md5')
      .update(req.body.newPassword)
      .digest('hex');

    await User.update({ password: newPass }, { where: { id: user.id } });
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};