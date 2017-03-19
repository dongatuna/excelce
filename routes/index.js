var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var Course = require('../models/course');
var models = require('../models/user');
var Cart = require('../models/cart');

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

router.get("/add-to-cart/:id", function(req, res, next){
   var courseId = req.params.id;
   var cart = new Cart(req.session.cart ? req.session.cart: {});

   Course.findById(courseId, function(err, course){
       if(err){return res.redirect('/');}//you need to add error messages in production

       cart.add(course, course.id);
       req.session.cart = cart;
        console.log(req.session.cart);
       res.redirect('/courses');
   });


});

router.get('/shopping-cart', function (req, res, next) {
    if(!req.session.cart){
        return res.render('pages/shopping-cart', {products:null});
    }

    var cart = new Cart(req.session.cart);

    res.render('pages/shopping-cart', {products:cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', function (req, res, next) {
    //if the user types gets checkout route without purchasing
    if(!req.session.cart){
        return res.redirect('pages/shopping-cart');
    }

    var cart = new Cart(req.session.cart);
    res.render('pages/checkout', {total:cart.totalPrice});
});

module.exports = router;
function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
