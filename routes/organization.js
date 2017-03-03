var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Organization = require('../models/organization');

var csrfProtection =  csrf();
router.use(csrfProtection);

router.get('/job', isLoggedIn, function (req, res) {
    res.render('users/organization/job', {csrfToken: req.csrfToken()});
});

router.get('/event', isLoggedIn, function (req, res) {
    res.render('users/organization/event', {csrfToken: req.csrfToken()});
});

router.get('/profile', isLoggedIn, function (req, res) {
    res.render('users/organization/profile', {csrfToken: req.csrfToken()});
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

router.get('/register', function (req, res) {
    //get any errors from passport
    var messages = req.flash('error');
    //pass the errors to the register page
    res.render('users/organization/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
});

//router.post('/users/register/:role')
router.post('/register', function(req, res, next){

    var email = req.body.email;

    if(req.body.password === req.body.password2){
        var password = req.body.password;
    }else{
        //if password does not match password
        req.flash("error", "Password must match confirm password");
        return res.redirect("/users/organization/register");
    }

    //validate the email and ensure email and password are not empty
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:6});

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
        res.render('users/organization/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});

    }

    Organization.findOne({email: email}, function (err, user){
        if (err) return next (err);

        if(user){
            req.flash("error", "User already exists");
            return res.redirect("/users/organization/signin");
        }

        var newOrganization = new Organization({
            email: email,
            password: password
        });
        newOrganization.save(next);
    });

} , passport.authenticate("local.organization.signup",
    {
        successRedirect: "/users/organization/profile",
        failureRedirect: "/users/organization/register",
        failureFlash: true
    }
));

//router for showing events - needs to be authenticated

router.get('/signin', function (req, res) {
    //get any errors from passport
    var messages = req.flash('error');
    //pass the errors to the register page
    res.render('users/organization/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
});

router.post('/signin', passport.authenticate('local.organization.signin',
    {
        successRedirect: '/users/organization/profile',
        failureRedirect: '/users/organization/signin',
        failureFlash: true
    }
));
//add log out path
router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/signin');
});

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