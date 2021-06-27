let services = [
    {
        name:'Users',
        path:'user',
        port:process.env.USER_SERVICE_PORT
    },
    {
        name:'Products',
        path:'product',
        port:process.env.PRODUCT_SERVICE_PORT
    },
    {
        name:'Requests',
        path:'request',
        port:process.env.REQUEST_SERVICE_PORT
    },
]

module.exports = services;