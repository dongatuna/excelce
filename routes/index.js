var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');


var Course = require('../models/course');

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

router.get('/users/signin', function (req, res) {
    res.render('users/signin', {csrfToken: req.csrfToken()})
});

router.get('/users/register/:role', function(req, res, next){
    //console.log('sign up page');
    res.render('users/register', {data: req.params, csrfToken: req.csrfToken()})
});
//local.signup is a passport authentication strategy defined in passport.js

router.post('/users/register/:role', passport.authenticate('local.signup', {
    successRedirect:'/users/employer/profile',
    failureRedirect: '/',
    failureFlash:true
}));

/*router.post('/users/register/:role', function(req, res, next){
    passport.authenticate('local.signup', function(err, user, info){
        if(err) return next(err);

        //if(user) return res.write('Go to log in page!');

        req.logIn(user, function(err){
            if(err) return next(err);
            return res.redirect('/users/'+req.body.role+'/profile');
        });
    })(req, res, next);
});*/

router.get('/users/:role/profile', function (req, res) {
    res.render('users/'+req.params.role+'/profile');
});

module.exports = router;


//resolve to separate tables for employers and job seekers - employer