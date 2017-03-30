var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
    user:{type:Schema.Types.ObjectId, ref:'User'},
    phone:{type:Boolean},
    sms:{type:Boolean},
    email:{type:Boolean},
    phonenumber:{type:String},
    createdAt:{type: Date, default:Date.now}
});

module.exports = mongoose.model('Notification', notificationSchema);
