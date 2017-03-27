var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var applicationsCtrl = require("../controllers/applications.Ctrl");
var passport = require('passport');


var csrfProtection =  csrf();
router.use(csrfProtection);

router.get("/create", isLoggedIn, function (req, res, next) {

    res.render('application/create', { csrfToken: req.csrfToken()});
});

router.post('/create', isLoggedIn, applicationsCtrl.createUserApplication );

//this gets the page of the providers/jobseeker's application
router.get("/viewall", isLoggedIn, applicationsCtrl.viewAllUserApplication );

router.post('/update', isLoggedIn, applicationsCtrl.updateUserApplication );

router.post('/delete', isLoggedIn, applicationsCtrl.deleteUserApplication);

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
