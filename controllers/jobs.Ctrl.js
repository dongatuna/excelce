"use strict";
var session = require('express-session');
var passport = require('passport');
var Posting = require("../models/jobposting");
var Post = require("../models/post");


var requirements = [
    "NAC/CNA", "75 hour Training/Home Care Aide","Core Basic Training", "BLS/CPR and First Aid",
    "Safety and Orientation", "Dementia Training", "Mental Health Training",
    "Nurse Delegation", "Nurse Delegation for Diabetes"
];

exports.getUserJobPosting = function (req, res) {
    res.render('job/create', {user:req.user, requirements:requirements, csrfToken: req.csrfToken()});
};

exports.createUserJobPosting = function (req, res) {

    var title = req.body.title;
    var description = req.body.description;
    var requirements = req.body.requirements;

    console.log("Requirements as a string");
    console.log(requirements);

    req.checkBody('description', 'Please include a description of your job .').notEmpty();
    req.checkBody('title', 'Please include a title of your job.').notEmpty();

    var filePath = req.body.file_attachment;
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
        return res.render('job/create', {csrfToken: req.csrfToken(), user:req.user, messages: messages, hasErrors:messages.length>0});
    }

    var newPosting= new Posting({
        organization: req.user,
        title: title,
        description:description,
        requirements: requirements,
        filePath: filePath
    });

    newPosting.save(function (err, posting) {
        if(err){return (err);}

        res.render("job/view", {posting:posting, update:true,user:req.user, csrfToken: req.csrfToken()});
    });
};


exports.renderUserJobPosting = function (req, res, next) {
    var id = req.params.id;

    Posting.findById(id).exec(function(err, posting){
        if(err) {return next(err);}

        res.render('job/update', {title: "Edit Job Posting", csrfToken: req.csrfToken(),
            user:req.user, requirements:requirements, posting:posting});
    });
};


exports.readAllUserJobPostings = function (req, res, next) {
    Posting.find().populate('organization respondents').sort({createdAt: "descending"}).exec(function(err, postings){
        if(err) {return next(err);}

        postings.map(function (posting) {
            posting.truncated_description = posting.description.substr(0, 300) + "...";
        });

        res.render('job/viewall', {title: "Job Postings",postings:postings, user:req.user});
    });
};

exports.updateUserJobPosting = function (req, res, next) {
    var id = req.params.id;

    Posting.findById(id).populate('organization').exec(function(err, posting){

        if(err) {return next(err);}
            posting.title = req.body.title;
            posting.description= req.body.description;
            posting.requirements = req.body.requirements;
            posting.imagePath = req.body.imagePath;

            posting.save(function (err) {
                if(err) {
                    next (err);
                    return;
                }

                req.flash("info", "Your job post has been updated");
                res.render("job/view", {posting:posting, update:true,user:req.user, csrfToken: req.csrfToken()});

            });


    });
};

exports.getCheckout = function (req, res, next) {
    if (!req.user) {
        req.flash("error", "Please sign in to complete posting your job opening");
        req.session.oldUrl = req.url;
        return res.redirect('/users/signin');
    }

    var errMsg = req.flash('error')[0];

    var stripeTotal = 60.00;

    res.render('job/checkout', {user:req.user, errMsg:errMsg, noError:!errMsg, stripeTotal:stripeTotal});
};

exports.postCheckout = function(req, res, next){

    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    var stripe = require("stripe")("sk_test_kWOaHzogv8SjynnUtJWU8RA6");

    // Token is created using Stripe.js or Checkout!
    // Get the payment token submitted by the form:
    var token = req.body.stripeToken; // Using Express
    // Create a Charge:
    stripe.charges.create({
        amount: 6000,//in cents
        currency: "usd",
        source: token,
        description: "Job Post Charge"
    },function (err, charge) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/job/checkout");
        }

        var post = new Post({
            user: req.user,
            address: req.body.address,
            name: req.body.name,
            postId: charge.id
        });

        post.save(function(err, result){
            if (err) {
                req.flash("error", err.message);
                return res.redirect("/job/checkout");
            }
            req.flash("success", "Your post was successful.  Please check your email for further instruction!");
            res.redirect("/users/success");
        });
    });
};

exports.getDeleteUserJobPosting = function (req, res) {
    var dele = true;
    var id = req.params.id;
    Posting.findById(id).exec(function(err, posting){
        if(err) {return next(err);}

        res.render('job/delete', {title: "Delete Job Posting", delete:dele, csrfToken: req.csrfToken(),
            user:req.user, posting:posting});
    });

};

exports.deleteUserJobPosting = function (req, res, next) {
    var id = req.params.id;

    Posting.findByIdAndRemove(id).exec();
    res.redirect('/users/success');
};