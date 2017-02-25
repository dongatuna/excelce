var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var event_schema = new Schema({
    presenter: {type:String, required:true},
    topic: {type:String, required:true},
    description: {type:String, required:true},
    price: {type: Number},
    imagePath:{type:String}
});

module.exports = mongoose.model('EventModel', event_schema);