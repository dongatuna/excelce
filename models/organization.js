var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var SALT_FACTOR = 10;

var organizationSchema = new Schema({
    email: {type: String, required:true, unique:true},
    password: {type: String, required:true},
    //HOW TO INCLUDE OTHER SCHEMAS IN THIS FILE AND THEN HAVE THE SCHEMA DEFINITIONS SOMEWHERE ELSE
    //jobs:[JobSchema],
    //events:[EventSchema]
    createdAt:{type: Date, default:Date.now}
});

var noop = function () {};

organizationSchema.pre("save", function (done) {

    var organization = this;

    if(!organization.isModified("password")) return done();

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if(err) return done (err);

        bcrypt.hash(organization.password, salt, noop, function (err, hashedPassword) {
            console.log('hashed password');
            console.log('err', err);
            if(err) return done(err);
            organization.password=hashedPassword;
            done();
        })
    })

});

organizationSchema.methods.checkPassword = function(guess, done){
    bcrypt.compare(guess, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};
module.exports = mongoose.model('Organization', organizationSchema);

