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
    res.redirect('/users/signin');
});

router.get('/provider', isLoggedIn, function (req, res) {

    //pass the errors to the register page
    res.render('users/provider', {user:req.user });
});

router.get('/organization', isLoggedIn, function (req, res) {

    //pass the errors to the register page
    res.render('users/organization', {user:req.user });
});

router.get('/success', isLoggedIn, function (req, res) {
    if(req.user.role==='organization'){
        console.log("Organizaton", req.user);
        return res.redirect("/users/organization");
    }else{
        console.log("Provider", req.user);
        return res.redirect("/users/provider");
    }
});

//all the routes below this function will not require authentication
router.use('/', notLoggedIn, function (req, res, next) {
    next();
});
router.get("/register/:role", function (req, res) {

    var role = req.params.role;
    //get any errors from passport
    var messages = req.flash('error');
    //pass the errors to the register page
    return res.render('users/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0, type: role, postUrl: '/users/register' });
});

//router.post('/users/register/:role')
router.post('/register', function(req, res, next){

        var email = req.body.email;
        var username = req.body.username;
        var role = req.body.role;
        var password = req.body.password;
        //validate the email and ensure email and password are not empty
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Password must be at least 6 characters long and match confirm password.').notEmpty().isLength({min:6}).equals(req.body.password2);
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
            var newUser = new models.User({
                email: email,
                username:username,
                password: password,
                role:role
            });
            newUser.save(next);
        });
        //
    },
    passport.authenticate("local.signin",
            {
                //successRedirect: '/users/success',
                failureRedirect: '/users/signin',
                failureFlash: true
            }
    ), function (req, res, next) {
        if(req.session.oldUrl){
            var oldUrl = req.session.oldUrl;
            req.session.oldUrl =null;
            res.redirect(oldUrl);

        }else{
            res.redirect('/users/success');
        }
    }

);

//router for signing in users
router.get('/signin', function (req, res) {
    //get any errors from passport
    console.log("I am in the get route");
    var messages = req.flash('error');
    //pass the errors to the register page
    res.render('users/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
});


router.post('/signin', passport.authenticate('local.signin',
     {
         failureRedirect: '/users/signin',
         failureFlash: true
     }), function (req, res, next) {
            if(req.session.oldUrl){
                var oldUrl = req.session.oldUrl;
                req.session.oldUrl =null;
                res.redirect(oldUrl);
            }else{
                res.redirect('/users/success');
            }
    }
 );

module.exports = router;



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/users/signin');
}

function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
