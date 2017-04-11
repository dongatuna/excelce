"use strict";

exports.getUserRegisterRoute = function (req, res) {
    var role = req.session.role;
    //get any errors from passport
    var messages = req.flash('error');
    //pass the errors to the register page
    return res.render('users/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0, type: role, isOrganization: (role === "organization"), postUrl: '/users/register' });
};

exports.getUserSignInRoute= function (req, res) {
    //get any errors from passport
    console.log("I am in the get route");
    var messages = req.flash('error');
    //pass the errors to the register page
    res.render('users/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
};

exports.getSuccessRoute = function (req, res) {
    if(req.user.role==='organization'){
        //console.log("Organizaton", req.user);
        return res.redirect("/users/organization");
    }else{
        //console.log("Provider", req.user);
        return res.redirect("/users/provider");
    }
};

exports.updateNotification = function(req, res, next) {
    var tel = req.body.tel;
    var mode= req.body.mode;
    var user = req.user;


    //validate the telephone number
    req.checkBody('tel', 'Phone number must be 10 digits').notEmpty().isLength({min:10});
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
        res.locals.messages = messages;
        return next();
    }

    user.tel = tel;
    user.notifyByPhone = req.body.notifyByPhone;
    user.notifyBySms = req.body.notifyBySms;
    user.notifyByEmail = req.body.notifyByEmail;
    user.save(next);
};

exports.renderNotification = function(req, res, next) {
    return res.render('users/notification', {
        csrfToken: req.csrfToken(),
        hasErrors: res.locals.messages && res.locals.messages.length>0,
        isOrganization: (req.user.role === "organization"),
        user: req.user
    });
};

/*
exports.displayProviderOrders = function (req, res, next) {
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
};

exports.displayOrganizationOrders =function (req, res) {

    var successMsg = req.flash("success")[0];
    Order.find({user:req.user}, function(err, orders){

        if(err){req.write("There has been an error");}

        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });

        res.render('users/organization', {orders:orders, user:req.user, successMsg: successMsg, noMessages: !successMsg});
    });
}
*/
