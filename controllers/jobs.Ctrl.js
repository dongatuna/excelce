"use strict";

var JobPosting = require("../models/jobposting");

exports.createUserJobPosting = function (req, res) {

    var title = res.body.title;
    var description = res.body.description;
    req.checkBody('description', 'You description should not empty.').notEmpty();
    //how do I include arrays
    var requirements = res.body.requirements;
    var imagePath = res.body.file_attachment;

    var newJob= new JobPosting({
        user: req.user,
        title: title,
        description:description,
        requirements: requirements,
        imagePath: imagePath
    });

    newJob.save();
};

exports.readUserJobPosting = function (req, res, next) {
    var id = req.params.id;

    JobPosting.findById(id).populate('organization respondents').exec(function(err, posting){
        if(err) {return next(err);}

        if(posting.respondents!==null){
            var contacts = posting.respondents.length;
        }else var contacts = "No ";

        res.render('job/view', {title: "Job Postings By You", posting:posting, contacts:contacts});
    });
};

exports.readAllUserJobPostings = function (req, res, next) {
    JobPosting.find().populate('organization respondents').sort({createdAt: "descending"}).exec(function(err, postings){
        if(err) {return next(err);}

        postings.map(function (posting) {
            posting.truncated_description = posting.description.substr(0, 300) + "...";
        });

        res.render('job/viewall', {title: "Job Postings",postings:postings});
    });
};

exports.updateUserJobPosting = function (req, res, next) {
    var id = req.body.id;

    JobPosting.findById(id, function(err, doc){
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

    res.redirect('/');
};

exports.deleteUserJobPosting = function (req, res, next) {
    var id = req.params.id;

    models.Job.findByIdAndRemove(id).exec();
    res.redirect('/');
};