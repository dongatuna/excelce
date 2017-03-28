"use strict";
var passport = require('passport');

exports.getUserRegisterRoute = function (req, res) {
    var role = req.session.role;
    //get any errors from passport
    var messages = req.flash('error');
    //pass the errors to the register page
    return res.render('users/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0, type: role, isOrganization: (role === "organization"), postUrl: '/users/register' });
}

exports.getUserSignInRoute= function (req, res) {
    //get any errors from passport
    console.log("I am in the get route");
    var messages = req.flash('error');
    //pass the errors to the register page
    res.render('users/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
}

exports.getSuccessRoute = function (req, res) {
    if(req.user.role==='organization'){
        console.log("Organizaton", req.user);
        return res.redirect("/users/organization");
    }else{
        console.log("Provider", req.user);
        return res.redirect("/users/provider");
    }
}