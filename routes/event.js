var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var models = require('../models/user');
var passport = require('passport');


var csrfProtection =  csrf();
router.use(csrfProtection);

//this gets the page of all the events displayed in a descending order
router.get("/view", function (req, res, next) {
    models.Event.find().sort({createdAt: "descending"}).exec(function(err, events){
        if(err) {return next(err);}

        res.render('users/event/view', {events:events});
    });
});

//to create an event
router.get('/create', isLoggedIn, function (req, res) {
    res.render('users/organization/event', {user:req.user, csrfToken: req.csrfToken()});
});

router.post("/create", isLoggedIn, function (req, res) {
    //collect all data from the path
    var poster = user;
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

});

module.exports = router;

//function to ensure that specific provider routes can be accessed after authentication
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        console.log('Logged in!!', req);
        next();
    }else{
        console.log('Logged in!!', req);
        req.flash("info", "You must log in to access this page.");
        res.redirect('/users/provider/signin');
    }
}
//function to use in the provider routes that do NOT require authentication
function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
