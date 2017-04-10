var express = require('express');
var router = express.Router();
//var csrf = require('csurf');
var Course = require('../models/course');
var models = require('../models/user');
var Cart = require('../models/cart');
var Order = require("../models/order");

var passport = require('passport');

//var csrfProtection =  csrf();
//router.use(csrfProtection);


/*router.use('/', notLoggedIn, function (req, res, next) {
    next();
});*/

/* GET courses page. */
router.get('/courses', function(req, res, next) {

   var successMsg = req.flash("success")[0];

    Course.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;

        for(var i=0; i<docs.length; i+=chunkSize){
            productChunks.push(docs.slice(i, i+chunkSize));
        }

        res.render('pages/courses', { title: 'courses', data: productChunks, user:req.user, successMsg: successMsg, noMessages: !successMsg });
    });
});

router.get("/add-to-cart/:id", function(req, res, next){
   var courseId = req.params.id;
   var cart = new Cart(req.session.cart ? req.session.cart: {});

   Course.findById(courseId, function(err, course){
       if(err){return
           res.redirect('/');
       }//you need to add error messages in production

       cart.add(course, course.id);
       req.session.cart = cart;
        console.log(req.session.cart);
       res.redirect('/courses');
   });
});

router.get('/reduce/:id', function (req, res, nex) {
    var productId = req.params.id;

    var cart = new Cart(req.session.cart?req.session.cart:{});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function (req, res, nex) {
    var productId = req.params.id;

    var cart = new Cart(req.session.cart?req.session.cart:{});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function (req, res, next) {
    if(!req.session.cart){
        return res.render('pages/shopping-cart', {products:null});
    }

    var cart = new Cart(req.session.cart);

    res.render('pages/shopping-cart', {user:req.user, products:cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', function (req, res, next) {
    if (!req.user) {
        req.flash("error", "Please sign in to finish checkout");
        req.session.oldUrl = req.url;
        return res.redirect('/users/signin');
    }
    //if the user types gets checkout route without purchasing
    if(!req.session.cart){
        return res.redirect('pages/shopping-cart');
    }

    var cart = new Cart(req.session.cart);

    var errMsg = req.flash('error')[0];

    var stripeTotal = cart.totalPrice*100;

    res.render('pages/checkout', {user:req.user, total:cart.totalPrice, errMsg:errMsg, noError:!errMsg, stripeTotal:stripeTotal});
});

router.post('/checkout', isLoggedIn, function(req, res, next){
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
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
        description: "Course Charge"
    },function (err, charge) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/checkout");
        }

        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });

        order.save(function(err, result){
            if (err) {
                req.flash("error", err.message);
                return res.redirect("/checkout");
            }

            req.flash("success", "Your order was successful.  Please check your email for further instruction!");
            req.session.cart = null;
            res.redirect("/users/success");
        });
    });
});


/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('pages/index', { user:req.user, title: 'Excel CE' });
});

module.exports = router;

function isLoggedIn(req, res, next){
     if(req.isAuthenticated()){
         return next();
     }
    req.session.oldUrl = req.url;
    res.redirect('/users/signin');

 }

//function to use in the provider routes that do NOT require authentication
/*function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}*/
