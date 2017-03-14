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
    res.redirect('/users/provider/signin');
});

router.get('/profile', isLoggedIn, function (req, res) {

    res.render('users/provider/profile', {csrfToken: req.csrfToken()});
});




router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

router.get('/register', function (req, res) {
    //get any errors from passport
    var messages = req.flash('error');

    res.render('users/provider/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
});

router.post('/register', function(req, res, next){

    var email = req.body.email;
    var username = req.body.username;
    var role = req.body.role;

    if(req.body.password === req.body.password2){
        var password = req.body.password;
    }else{
        //if password does not match password
        req.flash("error", "Password must match confirm password");
        return res.redirect("/users/provider/register");
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
        return res.render('/users/provider/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});

    }
    models.User.findOne({email: email}, function (err, user){
        if (err) return next (err);

        if(user){
            req.flash("error", "User already exists");
            return res.redirect("/users/provider/signup");
        }

        var newProvider = new models.User({
            email: email,
            username:username,
            password: password,
            role: role
        });

        newProvider.save(next);
    });

} , passport.authenticate("local.signup",
    {
        successRedirect: "/users/provider/profile",
        failureRedirect: "/users/provider/register",
        failureFlash:true
    }
 ));

/*router.get('/signin', function (req, res) {
    var messages = req.flash('error');
    res.render('users/provider/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
});


router.post('/signin', passport.authenticate('local.signin',
    {
        successRedirect: '/users/provider/profile',
        failureRedirect: '/users/provider/signin',
        failureFlash: true
    }
));*/

module.exports = router;

//function to ensure that specific provider routes can be accessed after authentication
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        console.log('Logged in!!', req);
     next();
    }else{
        console.log('Logged in!!', req);
        req.flash("info", "You must log in to access this page.");
        res.redirect('/users/provider/signin');
    }
}
//function to use in the provider routes that do NOT require authentication
function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
       return next();
    }
    res.redirect('/');
}
