var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Course = require('../models/course');
var Provider = require('../models/provider');
var Organization = require('../models/organization');

var csrfProtection =  csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Excel CE' });
});

/* GET home page. */
router.get('/courses', function(req, res, next) {
    Course.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;

        for(var i=0; i<docs.length; i+=chunkSize){
            productChunks.push(docs.slice(i, i+chunkSize));
        }

        res.render('pages/courses', { title: 'courses', data: productChunks });
    });
});

router.get('/users/organization/register', function (req, res) {
    //get any errors from passport
    var messages = req.flash('error');
    //pass the errors to the register page
    res.render('users/organization/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
});

router.get('/users/provider/register', function (req, res) {
    //get any errors from passport
    var messages = req.flash('error');

    res.render('users/provider/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
});

//router.post('/users/register/:role')
router.post('/users/organization/register', function(req, res, next){

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
            return res.redirect("/users/organization/register");
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

router.post('/users/provider/register', function(req, res, next){

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

//router for showing events - needs to be authenticated

router.get('/users/organization/signin', function (req, res) {
    //get any errors from passport
    var messages = req.flash('error');
    //pass the errors to the register page
    res.render('users/organization/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
});

router.post('/users/organization/signin', passport.authenticate('local.organization.signin',
    {
        successRedirect: '/users/organization/profile',
        failureRedirect: '/users/organization/signin',
        failureFlash: true
    }
));

router.post('/users/provider/signin', passport.authenticate('local.provider.signin',
    {
        successRedirect: '/users/organization/profile',
        failureRedirect: '/users/organization/signin',
        failureFlash: true
    }
));


router.get('/users/provider/signin', function (req, res) {
    var messages = req.flash('error');
    res.render('users/provider/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
});

router.get('/users/organization/job', function (req, res) {
    res.render('users/organization/job', {csrfToken: req.csrfToken()});
});

router.get('/users/organization/event', function (req, res) {
    res.render('users/organization/event', {csrfToken: req.csrfToken()});
});

router.get('/users/organization/profile', function (req, res, next) {
    res.render('users/organization/profile', {csrfToken: req.csrfToken()});
});

router.get('/users/provider/profile', function (req, res, next) {
    res.render('users/provider/profile', {csrfToken: req.csrfToken()});
});

router.get('/users/provider/application', function (req, res) {
    res.render('users/provider/application', {csrfToken: req.csrfToken()});
});
module.exports = router;


//resolve to separate tables for employers and job seekers - organization