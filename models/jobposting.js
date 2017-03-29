var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//this is a model for job posted by user employer
var postingSchema = new Schema({
    organization: [{type: Schema.Types.ObjectId, ref:'User'}],
    name: {type:String, required:true},
    title: {type:String, required:true},
    description: {type:String, required:true},
    requirements: {type:Array},
    filePath:{type:String},
    respondents:[{type:Schema.Types.ObjectId, ref:'User'}]
});

module.exports=mongoose.model('Posting', postingSchema);