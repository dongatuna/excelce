var mongoose = required('mongoose');
var Schema = mongoose.Schema;

var applicationSchema = new Schema ({
    name: {type:String, required:true},
    description: {type:String, required:true},
    requirements: {type:String},
    imagePath:{type:String}
});

module.exports=mongoose.model('Application', applicationSchema);