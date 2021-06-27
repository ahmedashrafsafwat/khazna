const  {User,Product,Request,sequelize}  = require('../models');
const { successResponse, errorResponse, uniqueId } = require('../helper');
const UUID = require('uuid');
const Sequelize = require('sequelize')
const Op = Sequelize.Op

exports.makeRequest = async (req, res) => {
  try {

    const user = await User.findOne({
        where: {id: req.body.userid}
    });
    if(user) {
        const product = await Product.findOne({
            where: {id: req.body.productid, price: {
                [Op.lte]: user.max_balance
            } }
        })

        if(product) {
            if(user.balance >= product.price) {
                let newBalance = product.price - user.balance;
                try {
                    const id = UUID.v1();
                const transaction = await sequelize.transaction()
                    let newRequest = {
                        id ,
                        userid:user.id,
                        productid:product.id,
                        status:'new',
                        price:product.price
                    }

                    await Promise.all([
                        user.update({balance: newBalance},{transaction}),
                        Request.create(newRequest,{transaction}) 
                    ])

                await transaction.commit();

             return successResponse("Request made", newRequest,200,res);
} catch(err) {
    throw new Error('Error in transaction:' + err)

}
            } else {
                throw new Error('Insufficent balance')
            }
    }else {
        throw new Error('Product not found')
    }

    }else {
        throw new Error('User not found')
    }
  } catch (error) {
    let message = error.message

    return errorResponse( message,404,{},res)
}
};

exports.cancelRequest = async (req, res) => {
    try {
        const { requestid, userid} = req.body;
        var transaction = await sequelize.transaction()

        const result= await Promise.all([
            User.findOne({where: {id: userid}},{transaction}),
            Request.findOne({where:{id: requestid}},{transaction}) 
        ])

        await transaction.commit();


        if(result[0] && result[1]) {
            let user = result[0], request = result[1];
            if(user.id == request.userid ) {
                if(request.status != 'canceled') {


                let newBalance = user.balance + request.price;
         transaction = await sequelize.transaction()

                const result2= await Promise.all([
                    user.update({balance: newBalance},{transaction}),
                    request.update({status:'canceled'},{transaction}) 
                ])      
        await transaction.commit();

        return successResponse("Request canceled successfully", request,200,res);
    } else {
        throw new Error("The request has already been canceled")

    }

            } else {
                throw new Error("Not the same user's request")
            }
        } else {
            throw new Error("couldn't find neither the user nor the request")

        }


    } catch (error) {
        let message = error.message
        return errorResponse( message,400,{},res)
    }
  };

