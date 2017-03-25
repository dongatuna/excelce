"use strict";

var Job = require("../models/User.Job");

exports.createUserJobPosting = function (req, res) {

    var title = res.body.title;
    var description = res.body.description;

    //how do I include arrays
    var requirements = res.body.requirements;
    var imagePath = res.body.file_attachment;

    var newJob= new Job({
        user: req.user,
        title: title,
        description:description,
        requirements: requirements,
        imagePath: imagePath
    });

    newJob.save();
};

exports.readUserJobPostings = function (req, res, next) {
    Job.find({"organization":req.user}).sort({createdAt: "descending"}).exec(function(err, postings){
        if(err) {return next(err);}

        res.render('views/job/listings', {title: "Your Job Postings", postings:postings});
    });
};

exports.readAllUserJobPostings = function (req, res, next) {
    Job.find().sort({createdAt: "descending"}).exec(function(err, postings){
        if(err) {return next(err);}

        res.render('views/job/listings', {postings:postings});
    });
};

exports.updateUserJobPosting = function (req, res, next) {
    var id = req.params.id;

    Job.findById(id, function(err, doc){
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

    Job.findByIdAndRemove(id).exec();
    res.redirect('/');
};