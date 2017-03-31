var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var jobsCtrl= require('../controllers/jobs.Ctrl');



var csrfProtection =  csrf();
router.use(csrfProtection);

//this gets the page of all the job postings displayed in a descending order -- will only allow applications if user
//is logged in
router.get("/viewall", jobsCtrl.readAllUserJobPostings);

router.get("/:id",  jobsCtrl.readUserJobPosting);

router.get('/create', isLoggedIn, function (req, res) {
    res.render('job/create', {csrfToken: req.csrfToken()});
});

router.post('/create', isLoggedIn, jobsCtrl.createUserJobPosting);

router.get('/update/:id', isLoggedIn, function (res, req) {
    var id = req.params.id;

    res.render('job/update', {id:id, csrfToken: req.csrfToken()});
});
router.post('/update/:id',  isLoggedIn, jobsCtrl.updateUserJobPosting);

router.get('/delete/:id', isLoggedIn, function (res, req) {
    res.render('job/delete', {csrfToken: req.csrfToken()});
});
router.post('/delete/:id', isLoggedIn, jobsCtrl.deleteUserJobPosting);

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
