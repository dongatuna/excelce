var passport = require('passport');
var Organization = require('../models/organization');
var Provider = require('../models/provider');

var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Organization.findById(id, function (err, user) {
        if (err) return done(err);

        if (user) return done(null, user);

        Provider.findById(id, function (err, user) {
            done(err, user);
        });
    });
});

//this local sign up strategy is used to log in existing organization
passport.use('local.organization.signup', new LocalStrategy({
    //this is where data is passed from form
    passwordField: 'password',
    usernameField: 'email',
    passReqToCallback: true
}, function (req, email, password, done) {

    Organization.findOne({'email':email}, function (err, user) {
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


//this local sign up strategy is used to log in existing provider
//the validation is done in the route
passport.use('local.provider.signup', new LocalStrategy({
    //this is where data is passed from form
    passwordField: 'password',
    usernameField: 'email',
    passReqToCallback: true
}, function (req, email, password, done) {

    Provider.findOne({'email':email}, function (err, user) {
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

//passport strategy for signing in the organization
passport.use('local.organization.signin', new LocalStrategy(
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

        Organization.findOne({email: email}, function (err, user){
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

//passport strategy for signing in the organization
passport.use('local.provider.signin', new LocalStrategy(
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
        Provider.findOne({email: email}, function (err, user){
            if (err) return next (err);

            if(!user){
                return done(null, false, {message: "No such user found"});
            }

            console.log('found provider', user);

            user.checkPassword(password, function (err, isMatch) {
                if(err) return done( err);

                if(isMatch){
                    console.log('password matched');
                    return done(null, user);
                }else{
                    return done(null, false, {message: "Invalid password"});
                }
            });

        });
    }
));