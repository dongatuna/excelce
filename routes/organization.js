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

router.get("/profile/:username", isLoggedIn, function (req, res) {
    res.render("users/organization/profile", {csrfToken: req.csrfToken()});
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

router.get('/register', function (req, res) {
    //get any errors from passport
    var messages = req.flash('error');
    //pass the errors to the register page
    res.render('users/organization/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0, type: 'organization', postUrl: '/users/organization/register' });
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
        return res.redirect("/users/organization/register");
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
        return res.render('users/organization/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
    }

    models.User.findOne({email: email}, function (err, user){
        if (err) return next (err);

        if(user){
            req.flash("error", "User already exists");
            return res.redirect("/users/organization/signup");
        }

        var newOrganization = new models.User({
            email: email,
            username:username,
            password: password,
            role:role
        });
        newOrganization.save(next);
    });

} , passport.authenticate("local.signup",
    {
        successRedirect: "/users/organization/profile",
        failureRedirect: "/users/organization/register",
        failureFlash: true
    }
));

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


