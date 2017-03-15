var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var models = require('../models/user');
var passport = require('passport');


var csrfProtection =  csrf();
router.use(csrfProtection);

//this gets the page of all the job postings displayed in a descending order -- will only allow applications if user
//is logged in
router.get("/view", function (req, res, next) {
    models.Posting.find().sort({createdAt: "descending"}).exec(function(err, postings){
        if(err) {return next(err);}

        res.render('view', {postings:postings});
    });
});

router.get('/create', isLoggedIn, function (req, res) {
    res.render('users/job/create', {csrfToken: req.csrfToken()});
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
