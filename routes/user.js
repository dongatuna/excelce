var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var models = require('../models/user');
var passport = require('passport');

var csrfProtection =  csrf();
router.use(csrfProtection);

//add log out path
router.get('/logout', isLoggedIn, function(req, res, next){
    req.logout();
    res.redirect('/signin');
});


router.get("/:role", function (req, res) {

    var role = req.params.role;
    //get any errors from passport
    var messages = req.flash('error');
    //pass the errors to the register page
    res.render('users/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0, type: role, postUrl: '/users/register' });
});

router.get('/provider', function (req, res) {
    //get any errors from passport
    var messages = req.flash('error');
    //pass the errors to the register page
    res.render('users/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0, type: 'provider', postUrl: '/users/register' });
});

//router.post('/users/register/:role')
router.post('/register', function(req, res, next){

        var email = req.body.email;
        var username = req.body.username;
        var role = req.body.role;

        if(req.body.password === req.body.password2){
            var password = req.body.password;
        }else{
            //if password does not match password
            req.flash("error", "Password must match confirm password");
            return res.redirect("/users/register");
        }

        //validate the email and ensure email and password are not empty
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Password must be at least 6 characters long.').notEmpty().isLength({min:6});
        req.checkBody('username', 'Username must NOT be empty.').notEmpty();
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

            //return done (null, false, req.flash('error', messages));
            return res.render('users/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
        }

        models.User.findOne({email: email}, function (err, user){
            if (err) return next (err);

            if(user){
                req.flash("error", "User already exists");
                return res.redirect("/users/"+role);
            }

            var newOrganization = new models.User({
                email: email,
                username:username,
                password: password,
                role:role
            });
            newOrganization.save(next);
        });
        //
    },
    passport.authenticate("local.signin", function(req, res, next){
            if(err) {return next(err);}

             req.logIn(user, function (err) {
                 if(err){return next(err);}

                 return res.redirect('users'+user.role);
             });

        }
    ));

//router for signing in users
router.get('/signin', function (req, res) {
    //get any errors from passport
    var messages = req.flash('error');
    //pass the errors to the register page
    res.render('users/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
});


router.post('/signin', function(req, res, next){
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

            //return done (null, false, req.flash('error', messages));
            return res.render('users/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
        }

    }, passport.authenticate("local.signin", function(req, res, next){
            if(err) {return next(err);}

            req.logIn(user, function (err) {
                if(err){return next(err);}

                return res.redirect('users'+user.role);
            });

        }
    )
);


/*
 //router for showing events - needs to be authenticated
 router.get('/signin', function (req, res) {
 //get any errors from passport
 var messages = req.flash('error');
 //pass the errors to the register page
 res.render('users/organization/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
 });

 router.post('/signin', passport.authenticate('local.signin',
 {
 successRedirect: '/users/organization/profile',
 failureRedirect: '/users/organization/signin',
 failureFlash: true
 }
 ));
 */

module.exports = router;

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("info", "You must log in to access this page.");
        res.redirect('/users/organization/signin');
    }
}

function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
