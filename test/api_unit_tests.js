const { expect } = require("chai");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");

chai.use(chaiHttp);
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);

// get tables
const  {User,Product,Request}  = require('../models');


var token = '',userid='',productid='',requestid='';
/**
 * Product Tests
 */
describe("Unit tests", function() {

  /* 
  * Clean Up the users used for tests
  * as we have only one database and no test database
  * so let's not drop the full table and recreate it using sequlize
  * in normal develop environment it's prefered to drop and then
  * start the recreating the tables from scratch
  */
  before(async function(){ 

    await User.destroy({ where: { email: 'testuser@gmail.com' } });
});

  describe("Testing user services", function() {
    it("Should be to register new user ", done => {
      chai
        .request(server)
        .post("/user/register")
        .send({
          'name': 'Test User',
          'email': 'testuser@gmail.com',
          'password': '1234',
          'balance':50,
          'max_balance':100
        })
        .set("Content-Type", "application/json")
        .end((err, res) => {

          // Check for returned result
          expect(res.body).to.have.all.keys('code','success','message','data');
          expect(res.body).to.have.property('code', 200);
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('message', 'User registered successfully');

          // console.log (result);
          done();
        });
    });
    it("Should be able to login", done => {
      chai
        .request(server)
        .post("/user/login")
        .send({
          'email': 'testuser@gmail.com',
          'password': '1234',
        })
        .set("Content-Type", "application/json")
        .end((err, res) => {
          // Check for returned result
          expect(res.body).to.have.all.keys('code','success','message','data');
          expect(res.body).to.have.property('code', 200);
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('message', 'User logged in');
          expect(res.body.data).to.have.all.keys('id','name','email','token',"balance","max_balance");

          token = res.body.data.token;
          userid = res.body.data.id;       
          
          done();
        });
    });
  })
    describe("Testing products services", function() {
        /* 
  * Clean Up the users used for tests
  * as we have only one database and no test database
  * so let's not drop the full table and recreate it using sequlize
  * in normal develop environment it's prefered to drop and then
  * start the recreating the tables from scratch
  */
  before(async function(){ 

    await Product.destroy({ where: { name: 'testproduct' } });

});

        it("Should be able to add new product", done => {
      chai
        .request(server)
        .post("/product/add")
        .send({
          "brand":"brand",
          "name":"testproduct",
          "category":"category1",
          "price":20
        })
        .set("Content-Type", "application/json")
        .set("x-token", token)
        .end((err, res) => {
          // Check for returned result
          expect(res.body).to.have.all.keys('code','success','message','data');
          expect(res.body).to.have.property('code', 200);
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('message', 'Product added');

          expect(res.body.data).to.have.all.keys('id','name','brand','category','price');
          productid = res.body.data.id;
                    
          done();
        });
    })

    it("Should be able to get all products for user that is lower than his max balance", done => {
      chai
        .request(server)
        .get(`/product/userproducts?id=${userid}`)
        .set("Content-Type", "application/json")
        .set("x-token", token)
        .end((err, res) => {
          // Check for returned result

          expect(res.body).to.have.all.keys('code','success','message','data');
          expect(res.body).to.have.property('code', 200);
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('message', 'Products');

          expect(res.body.data).to.have.lengthOf.above(1);

                    
          done();
        });
    })
  })
  describe("Testing request services", function() {


    it("Should be able to make request", done => {
  chai
    .request(server)
    .post("/request/makerequest")
    .send({
      userid,
      productid,
    })
    .set("Content-Type", "application/json")
    .set("x-token", token)
    .end((err, res) => {
      // Check for returned result
      expect(res.body).to.have.all.keys('code','success','message','data');
      expect(res.body).to.have.property('code', 200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('message', 'Request made');

      expect(res.body.data).to.have.all.keys('id','userid','productid','status','price');

      requestid = res.body.data.id;
                
      done();
    });
})

it("Should be able to get cancel a request with status of not canceled", done => {
  chai
    .request(server)
    .post(`/request/cancel`)
    .send({
      requestid,
      userid
    })
    .set("Content-Type", "application/json")
    .set("x-token", token)
    .end((err, res) => {
      // Check for returned result
      expect(res.body).to.have.all.keys('code','success','message','data');
      expect(res.body).to.have.property('code', 200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('message', 'Request canceled successfully');


                
      done();
    });
})
})

/**
 * Rows clean up
 */
after(async function(){ 

  await User.destroy({ where: { email: 'testuser@gmail.com' } });
  await Product.destroy({ where: { name: 'testproduct' } });
  await Request.destroy({ where: { id: requestid } });
});
});


