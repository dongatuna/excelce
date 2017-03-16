var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var models = require('../models/user');
var passport = require('passport');


var csrfProtection =  csrf();
router.use(csrfProtection);

//this gets the page of all the events displayed in a descending order
router.get("/view", function (req, res, next) {
    models.Application.find().sort({createdAt: "descending"}).exec(function(err, events){
        if(err) {return next(err);}

        res.render('event/view', {events:events});
    });
});

router.get("/create", isLoggedIn, function (req, res, next) {
    var applicant = req.params.username;

    res.render('application/create', {applicant:applicant, csrfToken: req.csrfToken()});
});


router.post('/create', isLoggedIn, function (req, res, next) {
   // var provider = res.body.applicant;
    var description = res.body.description;

    //how do I include arrays
    var requirements = res.body.requirements;
    var imagePath = res.body.file_attachment;

    var newPosting = new models.Posting({

        description:description,
        requirements: requirements,
        imagePath: imagePath
    });

    newPosting.save();
});


router.get("/delete", isLoggedIn, function (req, res, next) {

    res.render('application/delete', {applicant:applicant, csrfToken: req.csrfToken()});
});


router.post('/delete', isLoggedIn, function (req, res, next) {
    // var provider = res.body.applicant;
    var description = res.body.description;

    //how do I include arrays
    var requirements = res.body.requirements;
    var imagePath = res.body.file_attachment;

    var newPosting = new models.Posting({

        description:description,
        requirements: requirements,
        imagePath: imagePath
    });

    newPosting.save();
});


module.exports = router;

//function to ensure that specific provider routes can be accessed after authentication
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        console.log('Logged in!!', req);
        next();
    }else{
        console.log('Logged in!!', req);
        req.flash("info", "You must log in to access this page.");
        res.redirect('/users/signin');
    }
}
//function to use in the provider routes that do NOT require authentication
function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
