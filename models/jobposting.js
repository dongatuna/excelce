var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//this is a model for job posted by user employer
var postingSchema = new Schema({ //mongoose.Types.ObjectId
    organization: {type: Schema.Types.ObjectId, ref:'User'},
    title: {type:String, required:true},
    description: {type:String, required:true},
    requirements: {type:Array},
    filePath:{type:String},
    respondents:[{type:Schema.Types.ObjectId, ref:'Application', default:null}]
});

module.exports=mongoose.model('Posting', postingSchema);