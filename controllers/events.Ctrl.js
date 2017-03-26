"use strict";

var models = require("../models/user");

exports.createUserEvent = function (req, res) {
    //collect all data from the path
    var poster = req.user;
    var presenter= res.body.presenter;//include plust
    var topic = res.body.topic;
    var description = res.body.description;
    var eventdate = res.body.eventdate;
    var starttime = res.body.starttime;
    var endtime = res.body.endtime;
    var imagePath = res.body.file_attachment;

    //validate the email and ensure email and password are not empty
    req.checkBody('presenter', 'Please enter name of presenter').notEmpty();
    req.checkBody('topic', 'Enter the topic of the event.').notEmpty();
    req.checkBody('description', 'Enter description').notEmpty();
    //if the validation errors exist, store them in the variable errors
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
        return res.render('users/organization/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0});
    }

    var newEvent = new models.Event({
        poster:poster,
        presenter: presenter,
        topic: topic,
        description:description,
        eventdate: eventdate,
        starttime: starttime,
        endtime:endtime,
        imagePath: imagePath
    });

    newEvent.save();
};

exports.viewAllUserEvents = function(req, res){
    //find all events and list them
    models.Event.find().sort({createdAt: "descending"}).exec(function(err, events){
        if(err) {return next(err);}

        res.render('event/view', {events:events, title: "All Events"});
    });
};

exports.updateUserEvent = function(req, res, next){
    var id = req.body.id;

    models.Event.findById(id, function(err, doc){
        if (err) {
            console.error('error, no entry found');
        }

        doc.presenter = req.body.presenter;
        doc.topic = req.body.topic;
        doc.description = req.body.description;
        doc.eventdate = req.body.eventdate;
        doc.starttime = req.body.starttime;
        doc.endtime = req.body.endtime;
        doc.imagePath = req.body.imagePath;

        doc.save();
    });

    res.redirect('/event/view');
};

exports.deleteUserEvent = function(req, res, next){
    var id = req.params.id;

    Event.findByIdAndRemove(id).exec();

    res.redirect('/users/success');
};