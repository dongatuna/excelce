var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var eventsCtrl = require("../controllers/events.Ctrl");

var csrfProtection =  csrf();
router.use(csrfProtection);

//this gets the page of all the events displayed in a descending order
router.get("/view", eventsCtrl.viewAllUserEvents);

//to create an event
router.get('/create', isLoggedIn, function (req, res) {
    res.render('users/organization/event', {user:req.user, csrfToken: req.csrfToken()});
});

router.post("/create", isLoggedIn, eventsCtrl.createUserEvent );

router.post("/update", isLoggedIn, eventsCtrl.updateUserEvent);

router.post("/delete", isLoggedIn, eventsCtrl.deleteUserEvent);

module.exports = router;

//function to ensure that specific provider routes can be accessed after authentication
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        console.log('Logged in!!', req);
        next();
    }else{
        console.log('Logged in!!', req);
        req.flash("info", "You must log in to access this page.");
        res.redirect('/users/success');
    }
}
//function to use in the provider routes that do NOT require authentication
function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
