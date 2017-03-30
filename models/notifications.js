var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = new Schema({

    mode:{type:String, default: 'email'},
    phonenumber:{type:String},
    createdAt:{type: Date, default:Date.now}
});

module.exports = mongoose.model('Notification', notificationSchema);