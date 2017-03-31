"use strict";


var session = require('express-session');
var passport = require('passport');
var Application = require("../models/application");

exports.createUserApplication = function (req, res, next) {

    if(req.user.role==="provider"){

        var description = req.body.description;
        req.checkBody('description', 'You description should not empty.').notEmpty();
        //how do I include arrays
        var certifications = req.body.certifications;
        var imagePath = req.body.file_attachment;

        var newApplication = new  Application ({
            user: req.user,
            description:description,
            certifications: certifications,
            imagePath: imagePath
        });
        newApplication.save();
    }
};

exports.viewAllUserApplication = function(req, res, next){
    if(req.user.role==='organization'){

        Application.find().populate('provider').sort({}).exec(function(err, applications){
            if(err) {return next(err);}

            applications.map(function (application) {
                application.truncated_description = application.description.substr(0, 300) + "...";
            });
            res.render('application/viewall', {user:req.user, applications:applications, title: "View Application"});
        });
    }else{
        req.flash("error", "Only registered employers can view job seekers' profiles.");
        res.redirect('/users/provider');
    }
};

exports.viewUserApplication = function(req, res, next){
    var id = req.params.id;

    Application.findById(id).populate('provider').exec(function(err, application){
        if(err) {return next(err);}

        res.render('application/view', {user:req.user, application:application, title: "View Application"});
    });
};

exports.updateUserApplication = function(req, res, next){
    var id = req.body.id;

    Application.findById(id, function(err, doc){
        if (err) {
            console.error('error, no entry found');
        }

        doc.description = req.body.description;
        doc.certifications = req.body.certifications;
        doc.imagePath = req.body.imagePath;
        doc.save();
    });

    res.redirect('/application/view');
};


exports.deleteUserApplication = function(req, res, next){
    var id = req.params.id;

    Application.findByIdAndRemove(id).exec();

    res.redirect('/users/success');
};