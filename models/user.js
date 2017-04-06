var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Application = require("./application");
var bcrypt = require('bcrypt-nodejs');

var SALT_FACTOR = 10;
//this is a model of the User
var userSchema = new Schema({
    email: {type: String, required:true, unique:true},
    username:{type: String, required:true},
    password: {type: String, required:true},
    role: {type: String, enum: ['organization', 'provider'], required:true},
    application:{type:Schema.Types.ObjectId, ref:'Application', unique:true},
    notification:{type:Schema.Types.ObjectId, ref:'Notification'},
    createdAt:{type: Date, default:Date.now}
});



var noop = function () {};

userSchema.pre("save", function (done) {

    var user = this;

    if(!user.isModified("password")) return done();

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if(err) return done (err);

        bcrypt.hash(user.password, salt, noop, function (err, hashedPassword) {
            console.log('hashed password');
            console.log('err', err);
            if(err) return done(err);
            user.password=hashedPassword;
            done();
        })
    })

});

userSchema.methods.checkPassword = function(guess, done){
    bcrypt.compare(guess, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);

