var passport = require('passport');
var Organization = require('../models/organization');
var Provider = require('../models/provider');

var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Organization.findById(id, function (err, user) {
        done(err, user);
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