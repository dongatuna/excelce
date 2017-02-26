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
    res.render('users/organization/register', {csrfToken: req.csrfToken()});
});

router.get('/users/provider/register', function (req, res) {
    res.render('users/provider/register', {csrfToken: req.csrfToken()});
});

//router.post('/users/register/:role')

router.post('/users/organization/register', function(req, res, next){

    var email = req.body.email;

    if(req.body.password ===req.body.password2){
        var password = req.body.password;
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

} , passport.authenticate("login.organization.signup",{
    successRedirect: "/users/organization/profile",
    failureRedirect: "/users/organization/register",
    failureFlash:true
}));

router.post('/users/provider/register', function(req, res, next){

    var email = req.body.email;

    if(req.body.password ===req.body.password2){
        var password = req.body.password;
    }

    Provider.findOne({email: email}, function (err, user){
        if (err) return next (err);

        if(user){
            req.flash("error", "User already exists");
            return res.redirect("/users/provider/signin");
        }

        var newProvider = new Organization({
            email: email,
            password: password
        });

        newProvider.save(next);
    });

} , passport.authenticate("login.provider.signup",{
    successRedirect: "/users/provider/profile",
    failureRedirect: "/users/register/provider",
    failureFlash:true
}));

module.exports = router;


//resolve to separate tables for employers and job seekers - organization