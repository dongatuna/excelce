var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var SALT_FACTOR = 10;

var organizationSchema = new Schema({
    email: {type: String, required:true, unique:true},
    password: {type: String, required:true},
    createdAt:{type: Date, default:Date.now}
});

var noop = function () {};

organizationSchema.pre("save", function (done) {
    console.log('saving organization');

    var organization = this;

    if(!organization.isModified("password")) return done();

    console.log('generating salt');
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if(err) return done (err);

        console.log('hashing password');
        bcrypt.hash(organization.password, salt, null, function (err, hashedPassword) {
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

