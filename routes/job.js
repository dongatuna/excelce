var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var jobsCtrl= require('../controllers/jobs.Ctrl');
var passport = require('passport');


var csrfProtection =  csrf();
router.use(csrfProtection);

//this gets the page of all the job postings displayed in a descending order -- will only allow applications if user
//is logged in
router.get("/view", jobsCtrl.readAllUserJobPostings );

router.get('/create', isLoggedIn, function (req, res) {
    res.render('job/create', {csrfToken: req.csrfToken()});
});

router.post('/create', isLoggedIn, jobsCtrl.createUserJobPosting);

router.post('/update',  isLoggedIn,jobsCtrl.updateUserJobPosting);

router.post('/delete', isLoggedIn, jobsCtrl.deleteUserJobPosting);



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
