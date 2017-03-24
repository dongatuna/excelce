"use strict";

var Application = require("../models/User.Application");

exports.createUserApplication = function (req, res, next) {
    // var provider = res.body.applicant;
    var description = req.body.description;

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
};

exports.viewApplication = function(req, res, next){
    var id = req.body.id;

    Application.findById(id).exec(function(err, application){
        if(err) {return next(err);}

        res.render('users/application/view', {application:application, title: "All Events"});
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
    var id = req.body.id;

    Application.findByIdAndRemove(id).exec();

    res.redirect('/users/success');
};