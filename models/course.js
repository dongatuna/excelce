var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var course_schema = new Schema ({
    title: {type:String, required:true},
    description: {type:String, required:true},
    price: {type:Number, required:true},
    imagePath:{type:String, required:true}
});

module.exports=mongoose.model('CourseModel', course_schema);