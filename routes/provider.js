var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var Provider = require('../models/provider');
var passport = require('passport');

var csrfProtection =  csrf();
router.use(csrfProtection);

router.get('/register', function (req, res) {
    //get any errors from passport
    var messages = req.flash('error');

    res.render('users/provider/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
});



router.post('register', function(req, res, next){

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
        res.render('users/provider/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});

    }

    Provider.findOne({email: email}, function (err, user){
        if (err) return next (err);

        if(user){
            req.flash("error", "User already exists");
            return res.redirect("/users/provider/signin");
        }

        var newProvider = new Provider({
            email: email,
            password: password
        });

        newProvider.save(next);
    });

} , passport.authenticate("local.provider.signup",
    {
    successRedirect: "/users/provider/profile",
    failureRedirect: "/users/register/provider",
    failureFlash:true
    }
 ));

router.get('/signin', function (req, res) {
    var messages = req.flash('error');
    res.render('users/provider/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
});


router.post('/signin', passport.authenticate('local.provider.signin',
    {
        successRedirect: '/users/organization/profile',
        failureRedirect: '/users/organization/signin',
        failureFlash: true
    }
));

//add log out path
router.get('/logout')

router.get('/profile', isLoggedIn, function (req, res, next) {
    res.render('users/provider/profile', {csrfToken: req.csrfToken()});
});

router.get('/application', isLoggedIn, function (req, res, next) {
    res.render('users/provider/application', {csrfToken: req.csrfToken()});
});

module.exports = router;

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
     next();
    }else{
        req.flash("info", "You must log in to access this page.");
        res.redirect('/users/provider/signin');
    }
}