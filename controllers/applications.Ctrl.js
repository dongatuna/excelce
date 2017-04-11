"use strict";

var session = require('express-session');
var passport = require('passport');
var Application = require("../models/application");

var certifications = [
    "NAC/CNA", "75 hour Training/Home Care Aide","Core Basic Training","BLS/CPR and First Aid",
    "HIV/AIDS and Infection Control","Safety and Orientation", "Dementia Training", "Mental Health Training",
    "Nurse Delegation", "Nurse Delegation for Diabetes", "Developmental Disability Training"
];

exports.getUserJobApplication = function (req, res, next) {

    res.render('application/create', {user:req.user, certifications:certifications, csrfToken: req.csrfToken()});
};
exports.createUserApplication = function (req, res, next) {

    if(req.user.role==="provider"){

        var description = req.body.description;
        req.checkBody('description', 'You description should not empty.').notEmpty();
        //how do I include arrays
        var certifications = req.body.certifications;
        var filePath = req.body.file_attachment;

        var newApplication = new  Application ({
            user: req.user,
            description:description,
            certifications: certifications,
            filePath: filePath
        });
        newApplication.save(function (err, application) {
            if(err){return (err);}

            res.render("application/view", {application:application, update:true,user:req.user});
        });
    }
};

exports.viewAllUserApplication = function(req, res, next){
    if(req.user.role==='organization') {
        Application.find().populate('provider').sort({createdAt:"descending"}).exec(function(err, applications){
            if(err) {return next(err);}

            applications.map(function (application) {
                application.truncated_description = application.description.substr(0, 300) + "...";
            });

            res.render('application/viewall', {user:req.user, applications:applications, title: "View Application"});
        });
    } else {
        req.flash("error", "Only registered employers can view job seekers' profiles.");
        res.redirect('/application/info');
    }
};

exports.viewUserApplication = function(req, res, next){
    var id = req.params.id;

    Application.findById(id).populate("provider").exec(function(err, application){
        if(err) {return next(err);}


      var count = application.certifications.length;
      var certCount = certifications.length;
      var i, j;
        //create an array filled with all false values
        //fetch the data from database if
      for (i=0; i<=count;i++){
          for(j=i; j<=certCount;j++){
              if(application.certifications[j]===certifications[i]){
                  //var checked = true;
                  console.log(certifications[i]);
                  console.log(application.certifications[j]);
              }
          }
      }

       res.render('application/update', {user:req.user, application:application, csrfToken: req.csrfToken(), certifications:certifications, title: "View Application"});
    });
};

exports.updateUserApplication = function(req, res, next){
    var id = req.params.id;

    Application.findById(id, function(err, application){
        if (err) {
            console.error('error, no entry found');
        }
        application.certifications = req.body.certifications;
        application.description = req.body.descript;
        application.filePath = req.body.filePath;
        application.save();
    });
};


exports.deleteUserApplication = function(req, res, next){
    var id = req.params.id;

    Application.findByIdAndRemove(id).exec();

    res.redirect('/users/success');
};