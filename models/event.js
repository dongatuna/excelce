var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//this is a model for the event posted by the user employer
var eventSchema = new Schema({
    organization: {type:Schema.Types.ObjectId, ref:'User'},
    presenter: {type:String, required:true},
    topic: {type:String, required:true},
    description: {type:String, required:true},
    start:{type: Date},
    end:{type:Date},
    filePath:{type:String}
});

module.exports=mongoose.model('Event', eventSchema);