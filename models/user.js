var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var userSchema = new Schema({
    email: {type: String, required:true},
    password: {type: String, required:true},
    role: {type: String, enum:['employer', 'jobseeker'], default: 'jobseeker', required:true}
});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('User', userSchema);