"use strict";

var models = require("../models/user");

exports.createUserApplication = function (req, res, next) {
    // var provider = res.body.applicant;
    var description = req.body.description;
    req.checkBody('description', 'You description should not empty.').notEmpty();
    //how do I include arrays
    var certifications = req.body.certifications;
    var imagePath = req.body.file_attachment;

    var newApplication = new  models.Application ({
        user: req.user,
        description:description,
        certifications: certifications,
        imagePath: imagePath
    });
    newApplication.save();
};

exports.viewAllUserApplication = function(req, res, next){

    models.Application.find().exec(function(err, applications){
        if(err) {return next(err);}

        res.render('application/viewall', {applications:applications, title: "View Application"});
    });
};

exports.viewUserApplication = function(req, res, next){
    var id = req.params.id;

    models.Application.findById(id).exec(function(err, application){
        if(err) {return next(err);}

        res.render('application/view', {application:application, title: "View Application"});
    });
};


exports.updateUserApplication = function(req, res, next){
    var id = req.body.id;

    models.Application.findById(id, function(err, doc){
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

    models.Application.findByIdAndRemove(id).exec();

    res.redirect('/users/success');
};