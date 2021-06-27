const  {User,Product}  = require('../models');
const { successResponse, errorResponse, uniqueId } = require('../helper');
const UUID = require('uuid')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

exports.getUserProducts = async (req, res) => {
  try {

    const user = await User.findOne({
        where: {id: req.query.id}
    });
    if(user) {
        const products = await Product.findAll({
            where: {price: {
                [Op.lte]: user.max_balance
            } }
        })

        if(products.length > 0) {

        return successResponse("Products", products,200,res);
    }else {
        throw new Error('Products not found')
    }

    }else {
        throw new Error('User not found')
    }
  } catch (error) {
    let message = error.message

    return errorResponse( message,404,{},res)
}
};

exports.add = async (req, res) => {
    try {
        const { name, brand,category,price } = req.body;

        const id = UUID.v1()
        const productData = {
            id,name, brand,category,price
        };
      const newProduct = await Product.create(productData);

        if (newProduct) {
            return successResponse("Product added", productData,200,res);
        } else {
            throw new Error('Product not added')
        }

    } catch (error) {
        let message = error.message
        return errorResponse( message,400,{},res)
    }
  };

