// const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const userController =  require('../controller/user_controller');

const  {User}  = require('../models');

module.exports = function(passport) {
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use('local-login',
  new LocalStrategy({ 
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  }, async (req,  username, password, done) => {
    const result = await userController.login(req);
      done(null, result);
  })
);

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/user/login");
};


    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
      'local-signup',
      new LocalStrategy({
          // by default, local strategy uses username and password, we will override with email
          usernameField : 'email',
          passwordField : 'password',
          passReqToCallback : true // allows us to pass back the entire request to the callback
      },
      async function(req, username, password, done) {
          // find a user whose email is the same as the forms email
          // we are checking to see if the user trying to login already exists
          const result= await userController.register(req)

          done(null,result)
          return;
      })
  );
    }