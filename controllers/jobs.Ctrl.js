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

exports.readAllUserJobPostings = function (req, res, next) {
    Job.find().sort({createdAt: "descending"}).exec(function(err, postings){
        if(err) {return next(err);}

        res.render('view', {postings:postings});
    });
};

exports.updateUserJobPosting = function (req, res, next) {
    var id = req.user.id;

    Job.findById(id, function(err, doc){
        if (err) {
            console.error('error, no entry found');
        }


        doc.imagePath = req.body.imagePath;

        doc.save();
    });
};

exports.deleteUserJobPosting = function (req, res, next) {

};