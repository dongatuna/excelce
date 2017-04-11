var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) return done(err);
        if (user) return done(null, user);
    });
});

//passport strategy for signing in the user
passport.use('local', new LocalStrategy(
    {
        //this is where data is passed from form
        passwordField: 'password',
        usernameField: 'email',
        passReqToCallback: true
    }, function (req, email, password, done) {

        User.findOne({email: email}, function (err, user){
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

passport.use(new FacebookStrategy({
        clientID: "286814831741215",
        clientSecret: "2c2bf9d137d4139790c4e33adb29d7dc",
        callbackURL: "https://211f39bn.ngrok.io/users/success",
        enableProof: true,
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            if(err){return done(err);}
            done(null, user);
        });
    }
));

passport.use(new GoogleStrategy({
        clientID: "320818312142-purmb3530ngrn4i7d4cqskkgahf2p0uu.apps.googleusercontent.com",
        clientSecret: "pMtxXeocjMFAaXo310AHwqVs",
        callbackURL: "https://211f39bn.ngrok.io/users/success"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));

