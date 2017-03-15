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

//passport strategy for signing in the user
passport.use('local.signin', new LocalStrategy(
    {
        //this is where data is passed from form
        passwordField: 'password',
        usernameField: 'email',
        passReqToCallback: true
    }, function (req, email, password, done) {


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
