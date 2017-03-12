var passport = require('passport');
var models = require('../models/user');


var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {

    models.User.findById(id, function (err, user) {
        if (err) return done(err);
        if (user) return done(null, user);
    });
});

//this local sign up strategy is used to log in existing user
passport.use('local.signup', new LocalStrategy({
    //this is where data is passed from form
    passwordField: 'password',
    usernameField: 'email',
    passReqToCallback: true
}, function (req, email, password, done) {

    models.User.findOne({'email':email}, function (err, user) {
        //if you find an error, return the error
       if(err) return done(err);

       //if you find a user, then it means the email has been taken
        if(!user){
            return done(null, false, {message: 'No user has that email address.'});
        }

        user.checkPassword(password, function (err, isMatch) {
            if(err) return done(err);

            if(isMatch){
                return done (null, user);
            }else return done (null, false, {message:"Invalid password"});
        });
    });
}));




//passport strategy for signing in the user
passport.use('local.signin', new LocalStrategy(
    {
        //this is where data is passed from form
        passwordField: 'password',
        usernameField: 'email',
        passReqToCallback: true
    }, function (req, email, password, done) {

        //validate the email and ensure email and password are not empty
        req.checkBody('email', 'Invalid email or password').notEmpty().isEmail();
        req.checkBody('password', 'Invalid email or password ').notEmpty();

        //if the validation errors exist, store them in the variable errors
        var errors = req.validationErrors(); //validationErrors() extracts all errors of validation
        //store the errors messages in the error.msg property
        if(errors){
            //create an array of messages to pass to the view
            var messages = [];
            errors.forEach(function(error){
                //push any error you find INTO the messages array
                messages.push(error.msg);
            });
            return done (null, false, req.flash('error', messages));
        }

        models.User.findOne({email: email}, function (err, user){
            if (err) return next (err);

            if(!user){

                return done(null, false, {message: "No such user found"});
            }

            user.checkPassword(password, function (err, isMatch) {
                if(err) return done( err);

                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false, {message: "Invalid password"});
                }
            });
        });
    }
));
