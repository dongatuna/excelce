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

    var successMsg = req.flash("success")[0];

    Course.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;

        for(var i=0; i<docs.length; i+=chunkSize){
            productChunks.push(docs.slice(i, i+chunkSize));
        }

        res.render('pages/courses', { title: 'courses', data: productChunks, successMsg: successMsg, noMessages: !successMsg });
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

    var errMsg = req.flash('error')[0];

    res.render('pages/checkout', {total:cart.totalPrice, errMsg:errMsg, noError:!errMsg});
});

router.post("/checkout", function(req, res, next){
    if(!req.session.cart){
        return res.redirect('pages/shopping-cart');
    }

    var cart = new Cart(req.session.cart);

    // Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
    var stripe = require("stripe")("sk_test_kWOaHzogv8SjynnUtJWU8RA6");

// Token is created using Stripe.js or Checkout!
// Get the payment token submitted by the form:
    var token = req.body.stripeToken; // Using Express
    // Create a Charge:
    stripe.charges.create({
        amount: cart.totalPrice*100,//in cents
        currency: "usd",
        source: token,
        description: "Test Charge"
    },function (err, charge) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/checkout");
        }

        req.flash("success", "Successfully bought product!");
        req.session.cart = null;
        res.redirect("/index");
    });
});

module.exports = router;

//function to use in the provider routes that do NOT require authentication
function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}