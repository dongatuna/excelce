var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var multer = require('multer');
var jobsCtrl= require('../controllers/jobs.Ctrl');
var csrfProtection =  csrf();

router.get('/create', isLoggedIn, csrfProtection, jobsCtrl.getUserJobPosting);

router.post('/create', isLoggedIn, multer().single('file_attachment'), csrfProtection, jobsCtrl.createUserJobPosting);

//this gets the page of all the job postings displayed in a descending order -- will only allow applications if user
//is logged in
router.get("/viewall", jobsCtrl.readAllUserJobPostings);

router.get('/update/:id', isLoggedIn, multer().single('file_attachment'), csrfProtection,  jobsCtrl.renderUserJobPosting);

router.post('/update/:id',  isLoggedIn, multer().single('file_attachment'), csrfProtection, jobsCtrl.updateUserJobPosting);

router.get("/checkout/:id", isLoggedIn,  jobsCtrl.getCheckout );


router.post("/checkout", isLoggedIn,  jobsCtrl.postCheckout );

router.get('/delete/:id', isLoggedIn, multer().single('file_attachment'), csrfProtection,jobsCtrl.getDeleteUserJobPosting);
router.post('/delete/:id', isLoggedIn, multer().single('file_attachment'), csrfProtection, jobsCtrl.deleteUserJobPosting);

router.get("/:id",  isLoggedIn, jobsCtrl.readUserJobPosting);

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
    res.redirect('/users/success');
}
