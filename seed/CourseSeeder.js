var Course = require('../models/course');
var mongoose = require('mongoose');
mongoose.connect('mongodb://dongatuna:Embabros33@ds157349.mlab.com:57349/excelce');

var courses = [
    new Course({
        title: 'DSHS Basic Communication CE [2 hours]' ,
        description: 'Some of the topics include client rights, mandatory reporting and restraints.  This CE is based on WA DSHS curriculum and it is equivalent to 2 hours of continuing education units.' ,
        price: 12,
        imagePath: '../images/DSHS - Basic Communication CE.png'
    }),

    new Course({
        title: 'DSHS Blood Bourne Pathogens [1 hour]',
        description: 'Some of the topics covered include common blood bourne diseases, how they spread, standard precautions and HIV/AIDS.  This course is based on WA DSHS curriculum and is equivalent to 1 hour of continuing education unit.' ,
        price: 13 ,
        imagePath:'public/images/DSHS - Blood Bourne Pathogens CE.png'
    }),

    new Course({
        title: 'DSHS Client Rights [2 hours]' ,
        description: 'Some of the topics covered include client rights and mandatory reporting and alternatives to restraints.  This course is based on WA DSHS curriculum and is equivalent to 2 hours of continuing education units.',
        price:14 ,
        imagePath:'public/images/DSHS - Client Rights CE.png'
    }),

    new Course({
        title:'DSHS Elimination CE [2 hours]' ,
        description:'Some of the topics covered include bowel and bladder, toileting, pericare, bedpan, catheter care.  This course is based on WA DSHS curriculum and is equivalent to 2 hours of continuing education units.' ,
        price: 15,
        imagePath:'public/images/DSHS - Elimination CE.png'
    }),

    new Course({
        title:"DSHS Food Handling CE [0.5 hour]" ,
        description: "Some of the topics covered are food borne illness and safe food handling practices.  This course is based on WA DSHS curriculum and is equivalent to 0.5 hour of continuing education units.",
        price:16 ,
        imagePath:"public/images/DSHS - Food Handling CE.png"
    }),

    new Course({
        title:"DSHS Food Handling CE [1.5 hours]" ,
        description:"Some of the topics covered include types of loss, grieving process and symptoms, being present with others.  This course is based on WA DSHS curriculum and is equivalent to 1.5 hours of continuing education units." ,
        price:17 ,
        imagePath:"public/images/DSHS - Food Handling CE.png"
    })
];

var done=0;
for(var i=0; i<courses.length; i++){
    courses[i].save(function(err, result){
       done++;
       if(done===courses.length){
           exit();
           console.log('items saved');
       }
    });
}

function exit() {
    mongoose.disconnect();
}
