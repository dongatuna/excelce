"use strict";

var models = require("../models/user");

exports.createUserJobPosting = function (req, res) {

    var title = res.body.title;
    var description = res.body.description;
    req.checkBody('description', 'You description should not empty.').notEmpty();
    //how do I include arrays
    var requirements = res.body.requirements;
    var imagePath = res.body.file_attachment;

    var newJob= new models.Job({
        user: req.user,
        title: title,
        description:description,
        requirements: requirements,
        imagePath: imagePath
    });

    newJob.save();
};

exports.readUserJobPostings = function (req, res, next) {
    models.Job.find({_id:req.user._id}).sort({createdAt: "descending"}).exec(function(err, postings){
        if(err) {return next(err);}

        res.render('job/listings', {title: "Job Postings By You", postings:postings});
    });
};

exports.readAllUserJobPostings = function (req, res, next) {
    models.Job.find().sort({createdAt: "descending"}).exec(function(err, postings){
        if(err) {return next(err);}

        res.render('job/listings', {title: "Job Postings",postings:postings});
    });
};

exports.updateUserJobPosting = function (req, res, next) {
    var id = req.body.id;

    models.Job.findById(id, function(err, doc){
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