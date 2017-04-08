var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseSchema = new Schema ({
    title: {type:String, required:true},
    description: {type:String, required:true},
    price: {type:Number, required:true},
    filePath:{type:String, required:true}
});

module.exports=mongoose.model('Course', courseSchema);