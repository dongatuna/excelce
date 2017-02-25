var passport = require('passport');
var User = require('../models/user');

var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

//this local sign up strategy is used to create users
passport.use('local.signup', new LocalStrategy({
    //this is where data is passed from form
    passwordField: 'password',
    usernameField: 'email',
    passReqToCallback: true
}, function (req, email, password, done) {

    User.findOne({'email':email}, function (err, user) {
        //if you find an error, return the error
       if(err) return done(err);

       //if you find a user, then it means the email has been taken
        if(user){
            return done(null, false, {message: 'Email is already in use.'});
        }
            //if there is no error and the email is not in use, we can create new user
            //using mongoose
            var newUser = new User();

            //var role = newUser.role;
            if(req.body.role) return req.body.role;

            newUser.role = req.body.role;
            newUser.email = email;

            //encrypt password
            if(req.body.password===req.body.password2){
                newUser.password = newUser.encryptPassword(password);
            } else return done(null, false, {message: 'Password must match confirm password'});

            //var results = role(req.body.role);

            newUser.save(function (err, result) {
                if(err){
                    return done(err);
                }
                console.log('new user added');
                return(null, newUser);
            });

    });

}));
