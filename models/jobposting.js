var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var posting_schema = new Schema({
    name: {type:String, required:true},
    title: {type:String, required:true},
    description: {type:String, required:true},
    requirements: {type:String},
    imagePath:{type:String}
});

module.exports=mongoose.model('JobModel', posting_schema);