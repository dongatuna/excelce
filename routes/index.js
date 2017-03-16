var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var Course = require('../models/course');
var models = require('../models/user');

var passport = require('passport');

var csrfProtection =  csrf();
router.use(csrfProtection);

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('pages/index', { title: 'Excel CE' });
});

/* GET courses page. */
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

module.exports = router;
function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
