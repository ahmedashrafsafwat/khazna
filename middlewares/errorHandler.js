const { errorResponse } = require('../helper');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let messages = err.map(e => e.msg);
    messages = `${messages.join(', ')}`;
    
    return errorResponse(messages, 400, err,res);
};

exports.default = errorHandler;