var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var Course = require('../models/course');
var models = require('../models/user');

var passport = require('passport');

var csrfProtection =  csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('pages/index', { title: 'Excel CE' });
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

//router for signing in users
router.get('/users/signin', function (req, res) {
    //get any errors from passport
    var messages = req.flash('error');
    //pass the errors to the register page
    res.render('users/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
});


router.post('/users/signin', passport.authenticate('local.signin'), function(req, res){
    console.log("Here is here");
    //res.redirect('/users/'+req.user.role+'/profile/'+req.user.username);

    res.redirect('/users/'+req.user.role+'/profile/');
});


/* GET courses page. */
router.get('/courses',notLoggedIn, function(req, res, next) {
    Course.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;

        for(var i=0; i<docs.length; i+=chunkSize){
            productChunks.push(docs.slice(i, i+chunkSize));
        }

        res.render('pages/courses', { title: 'courses', data: productChunks });
    });
});

module.exports = router;
function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
