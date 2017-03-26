var models = require('../models/user');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/expaddress");

var jobpostings = [
    new models.Application({
        provider: {
            "_id" : "58d7f0ffe28554298c5ec16c",
            "email" : "dauds@aol.com",
            "username" : "Daud Soloman",
            "password" : "$2a$10$F3eWRFTjp4yTVgwCs/31BOqcRKUceAVuRwr.diEWMpiUDS9/ONxly",
            "role" : "provider",
            "createdAt" : "2017-03-26T16:49:03.663Z",
            "__v" : 0
        },
        description: 'Some of the topics include client rights, mandatory reporting and restraints.  ' +
        'This CE is based on WA DSHS curriculum and it is equivalent to 2 hours of continuing education units.' ,
        certification:["HCA", "Nurse Delegation", "Diabetes", "Dementia", "Mental Health"],
        filePath: '../files/resumes/rn_resume_st_francis.txt'
    }),

    new models.Application({
        provider: {
            "_id" : "58d7f0dde28554298c5ec16b",
            "email" : "judy@msn.com",
            "username" : "Judy Too",
            "password" : "$2a$10$cRCIwAGD2DMC/rJsCkO28.MJko1UIXSq4X8ugA0ZQzXVIkPmMxzp.",
            "role" : "provider",
            "createdAt" : "2017-03-26T16:48:29.974Z",
            "__v" : 0
        },
        description: 'Some of the topics include client rights, mandatory reporting and restraints.  ' +
        'This CE is based on WA DSHS curriculum and it is equivalent to 2 hours of continuing education units.' ,
        certification: ["CNA", "Dementia", "Mental Health"],
        filePath: '../files/resumes/rn_resume_seattle_children.txt'
    }),

    new models.Application({
        provider: {
            "_id" : "58d7f149e28554298c5ec16e",
            "email" : "henry@test.com",
            "username" : "King Henry",
            "password" : "$2a$10$n4UbIK135KDhZas5RGEAee1AOst5gxivMPMTHjWR42stat6LudVfO",
            "role" : "provider",
            "createdAt" : "2017-03-26T16:50:17.947Z",
            "__v" : 0
        },
        description: 'Some of the topics include client rights, mandatory reporting and restraints.  This CE is based on WA DSHS curriculum and it is equivalent to 2 hours of continuing education units.' ,
        certification: ["CNA"],
        filePath: '../files/resumes/rn_resume_northwest.txt'
    }),

    new models.Application({
        provider: {
            "_id" : "58d7f11ee28554298c5ec16d",
            "email" : "galv@seattle.com",
            "username" : "Galv-Seattle",
            "password" : "$2a$10$JD9WHS5mhSat6bJJaQ/ZqeYk55ZHqkSBETGXAyZcjmVuPOj2Tt73O",
            "role" : "provider",
            "createdAt" : "2017-03-26T16:49:34.746Z",
            "__v" : 0
        },
        description: 'Some of the topics include client rights, mandatory reporting and restraints.  This CE is based on WA DSHS curriculum and it is equivalent to 2 hours of continuing education units.' ,
        certification: ["CNA", "CPRFA"],
        filePath: '../files/resumes/rn_resume_harborview.txt'
    })
];

var done=0;
for(var i=0; i<jobpostings.length; i++){
    jobpostings[i].save(function(err, result){
        done++;
        if(done===jobpostings.length){
            exit();
            console.log('items saved');
        }
    });
}

function exit() {
    mongoose.disconnect();
}