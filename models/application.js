var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require("./user");

//this is a model for the application posted by user provider
var applicationSchema = new Schema ({
    provider:{type:Schema.Types.ObjectId, ref:'User'},
    description: {type:String, required:true},
    certifications: [{type:String}],
    filePath:{type:String}
});

module.exports=mongoose.model('Application', applicationSchema);