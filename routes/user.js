var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var User = require("../models/user");
var usersCtrl = require('../controllers/users.Ctrl');


var csrfProtection =  csrf();
router.use(csrfProtection);

//add log out path
router.get('/logout', isLoggedIn, function(req, res, next){
    req.logout({user:req.user});
    res.redirect('/users/signin');
});

router.get('/provider', isLoggedIn, usersCtrl.displayProviderApplicationsandOrders);

router.get('/organization', isLoggedIn, usersCtrl.displayOrganizationPostsandOrders);

router.get('/success', isLoggedIn, usersCtrl.getSuccessRoute);

router.get("/register/:role", function (req, res) {
    req.session.role = req.params.role;
    return res.redirect("/users/register");
});

router.get("/register", usersCtrl.getUserRegisterRoute);

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/success/facebook',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    usersCtrl.mustHaveRoleChosen,
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

router.get('/auth/google',
    passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));


router.get('/success/google',
    passport.authenticate('google', { failureRedirect: '/login' }),
    usersCtrl.mustHaveRoleChosen,
    function(req, res) {
        res.redirect('/');
    }
);

router.get('/choose-role', isLoggedIn, usersCtrl.chooseRole, usersCtrl.goToRole);
router.post('/choose-role', isLoggedIn, usersCtrl.setRole, usersCtrl.goToRole);

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
    passport.authenticate("local",
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


router.post('/signin', passport.authenticate('local',
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

router.get('/notification', isLoggedIn, usersCtrl.renderNotification);

router.post('/notification', isLoggedIn, usersCtrl.updateNotification, usersCtrl.renderNotification);

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/users/signin');
}
