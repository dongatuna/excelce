"use strict";

var Posting = require("../models/jobposting");

exports.createUserJobPosting = function (req, res) {

    var title = req.body.title;
    var description = req.body.description;
    req.checkBody('description', 'Please include a description of your job .').notEmpty();
    req.checkBody('title', 'Please include a title of your job.').notEmpty();
    //how do I include arrays
    var requirements = req.body.requirements;
    var imagePath = req.body.file_attachment;
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
        return res.render('job/create', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
    }

    var newPosting= new Posting({
        user: req.user,
        title: title,
        description:description,
        requirements: requirements,
        imagePath: imagePath
    });

    newPosting.save();
};

exports.readUserJobPosting = function (req, res, next) {
    var id = req.params.id;

    Posting.findById(id).populate('organization respondents').exec(function(err, posting){
        if(err) {return next(err);}

        if(posting.respondents!==null){
            var contacts = posting.respondents.length;
        }else var contacts = "No ";

        res.render('job/view', {title: "Job Postings By You", posting:posting, contacts:contacts});
    });
};

exports.readAllUserJobPostings = function (req, res, next) {
    Posting.find().populate('organization respondents').sort({createdAt: "descending"}).exec(function(err, postings){
        if(err) {return next(err);}

        postings.map(function (posting) {
            posting.truncated_description = posting.description.substr(0, 300) + "...";
        });

        res.render('job/viewall', {title: "Job Postings",postings:postings});
    });
};

exports.updateUserJobPosting = function (req, res, next) {
    var id = req.params.id;

    Posting.findById(id, function(err, doc){
        if (err) {
            //console.error('error, no entry found');
            res.send(404, 'no entry found');
        }

        doc.title = req.body.title;
        doc.description= req.body.description;
        doc.requirements= req.body.requirements;
        doc.imagePath = req.body.imagePath;

        doc.save();
    });

    res.redirect('/users/success');
};

exports.deleteUserJobPosting = function (req, res, next) {
    var id = req.params.id;

    Posting.findByIdAndRemove(id).exec();
    res.redirect('/users/success');
};