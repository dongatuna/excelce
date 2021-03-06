var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var SALT_FACTOR = 10;

var providerSchema = new Schema({
    email:{type: String, required:true, unique:true},
    username:{type: String, required:true, unique:true},
    password:{type: String, required:true},
    role: {type: String, enum: ['organization', 'provider'], required:true},
    createdAt:{type: Date, default:Date.now}
});

var applicationSchema = new Schema ({
    provider:[providerSchema],
    name: {type:String, required:true},
    description: {type:String, required:true},
    requirements: {type:String},
    imagePath:{type:String}
});

var noop = function () {};

providerSchema.pre("save", function (done) {
    var provider = this;

    if(!provider.isModified("password")) return done();

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if(err) return done (err);

        bcrypt.hash(provider.password, salt, noop, function (err, hashedPassword) {
            if(err) return done(err);
            provider.password=hashedPassword;
            done();
        })
    })

});

providerSchema.methods.checkPassword = function(guess, done){
    bcrypt.compare(guess, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};

var Provider = mongoose.model('Provider', providerSchema);
var Application = mongoose.model('Application', applicationSchema);

module.exports = {
    Provider: Provider,
    Application:Application
};

