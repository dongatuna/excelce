var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var usersCtrl = require('../controllers/users.Ctrl');
var User = require("../models/user");
var Order = require("../models/order");
var Cart = require("../models/cart");
var Posting = require("../models/jobposting");

var csrfProtection =  csrf();
router.use(csrfProtection);

//add log out path
router.get('/logout', isLoggedIn, function(req, res, next){
    req.logout({user:req.user});
    res.redirect('/users/signin');
});

router.get('/provider', isLoggedIn, function (req, res, next) {
    var successMsg = req.flash("success")[0];

    Order.find({user:req.user}, function(err, orders){

        if(err){req.write("There has been an error");}

        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });

        var messages = req.flash('error');

        res.render('users/provider', {orders:orders, user:req.user, messages:messages, hasErrors:messages.length>0, successMsg: successMsg, noMessages: !successMsg});
    });
});

router.get('/organization', isLoggedIn, function (req, res, next) {

   var successMsg = req.flash("success")[0];

/*   Order.find({user:req.user}, function(err, orders){

        if(err){req.write("There has been an error");}

        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        //res.render('users/organization', {posts:posts, orders:orders, user:req.user, successMsg: successMsg, noMessages: !successMsg});

    });
   */

    Posting.find({"organization":req.user}).sort({createdAt: "descending"}).exec(function(err, posts){
       if(err) {return next(err);}

        res.render('users/organization', {posts:posts, user:req.user, successMsg: successMsg, noMessages: !successMsg});



   });




});

router.get('/success', isLoggedIn, usersCtrl.getSuccessRoute);

router.get("/register/:role", function (req, res) {
    req.session.role = req.params.role;
    return res.redirect("/users/register");
});

router.get("/register", usersCtrl.getUserRegisterRoute);

router.post('/register', function(req, res, next){

        var email = req.body.email;
        var username = req.body.username;
        var role = req.body.role;
        var password = req.body.password;
        //validate the email and ensure email and password are not empty
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Password must be at least 6 characters long and match ' +
            'confirm password.').notEmpty().isLength({min:6}).equals(req.body.password2);
        req.checkBody('username', 'Username must NOT be empty.').notEmpty();
        //if the validation errors exist, store them in the variable errors
        var errors = req.validationErrors(); //validationErrors() extracts all errors of validation
        //store the errors messages in the error.msg property
        if(errors){
            //create an array of messages to pass to the view
            var messages = [];
            errors.forEach(function(error){
                //push any error you find INTO the messages array
                messages.push(error.msg);
            });
            //return done (null, false, req.flash('error', messages));
            return res.render('users/register', {csrfToken: req.csrfToken(), messages: messages,
                hasErrors:messages.length>0, isOrganization: (role === "organization")});
        }

        User.findOne({email: email}, function (err, user){
            if (err) return next (err);

            if(user){
                req.flash("error", "User already exists");
                return res.redirect("/users/register");
            }
            var newUser = new User({
                email: email,
                username:username,
                password: password,
                role:role
            });
            newUser.save(next);
        });
        //
    },
    passport.authenticate("local.signin",
        {
            //successRedirect: '/users/success',
            failureRedirect: '/users/signin',
            failureFlash: true
        }
    ), function (req, res, next) {
        if(req.session.oldUrl){
            var oldUrl = req.session.oldUrl;
            req.session.oldUrl =null;
            res.redirect(oldUrl);

        }else{
            res.redirect('/users/success');
        }
 });

//router for signing in users
router.get('/signin', usersCtrl.getUserSignInRoute);


router.post('/signin', passport.authenticate('local.signin',
     {
         failureRedirect: '/users/signin',
         failureFlash: true
     }), function (req, res, next) {
            if(req.session.oldUrl){
                var oldUrl = req.session.oldUrl;
                req.session.oldUrl =null;
                res.redirect(oldUrl);
            }else{
                res.redirect('/users/success');
            }
    }
 );

router.get('/notification', isLoggedIn, usersCtrl.findNotification, usersCtrl.renderNotification);

router.post('/notification', isLoggedIn, usersCtrl.findNotification, usersCtrl.updateNotification, usersCtrl.renderNotification);

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/users/signin');
}
