var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    presenter: {type:String, required:true},
    topic: {type:String, required:true},
    description: {type:String, required:true},
    //start:{type: Date},
    //end:{type:Date},
    imagePath:{type:String}
});

module.exports = mongoose.model('Event', eventSchema);