var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var User = require('../models/user');
var passport = require('passport');


var csrfProtection =  csrf();
router.use(csrfProtection);

//add log out path
router.get('/logout', isLoggedIn, function(req, res, next){
    req.logout();
    res.redirect('/signin');
});

router.get('/job', isLoggedIn, function (req, res) {
    res.render('users/organization/job', {csrfToken: req.csrfToken()});
});

router.post('/job', isLoggedIn, function (req, res) {
    var name = res.body.name;
    var title = res.body.title;
    var description = res.body.description;

    //how do I include arrays
    var requirements = res.body.requirements;
    var imagePath = res.body.file_attachment;

    var newPosting = new models.Posting({
        name: name,
        title: title,
        description:description,
        requirements: requirements,
        imagePath: imagePath
    });

    newPosting.save();

});

router.get('/event', isLoggedIn, function (req, res) {
    res.render('users/organization/event', {csrfToken: req.csrfToken()});
});

router.post('/event', isLoggedIn, function (req, res) {
    var presenter= res.body.presenter;
    var topic = res.body.topic;
    var description = res.body.description;

    var eventdate = res.body.eventdate;
    var starttime = res.body.starttime;
    var endtime = res.body.endtime;
    var imagePath = res.body.file_attachment;

    var newEvent = new models.Event({
        presenter: presenter,
        topic: topic,
        description:description,
        eventdate: eventdate,
        starttime: starttime,
        endtime:endtime,
        imagePath: imagePath
    });

    newEvent.save();

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

    User.findOne({email: email}, function (err, user){
        if (err) return next (err);

        if(user){
            req.flash("error", "User already exists");
            return res.redirect("/users/organization/signup");
        }

        var newOrganization = new User({
            email: email,
            password: password,
            role:role
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


