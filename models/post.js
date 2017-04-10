var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema ({
    user: {type:Schema.Types.ObjectId, ref:'User'},
    address: {type: String, required: true},
    name: {type: String, required: true},
    createdAt:{type: Date, default:Date.now},
    postId: {type:String, required: true}
});

module.exports=mongoose.model('Post', postSchema);