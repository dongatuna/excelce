var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var SALT_FACTOR = 10;
//this is a model of the employer
var organizationSchema = new Schema({
    email: {type: String, required:true, unique:true},
    username:{type: String, required:true, unique:true},
    password: {type: String, required:true},
    role: {type: String, enum: ['organization', 'provider'], required:true},
    createdAt:{type: Date, default:Date.now}
});
//this is a model for job posted by employer
var postingSchema = new Schema({
    organization: [organizationSchema],
    name: {type:String, required:true},
    title: {type:String, required:true},
    description: {type:String, required:true},
    requirements: [],
    imagePath:{type:String}
});
//this is a model for the event posted by the employer
var eventSchema = new Schema({
    organization: [organizationSchema],
    presenter: {type:String, required:true},
    topic: {type:String, required:true},
    description: {type:String, required:true},
    start:{type: Date},
    end:{type:Date},
    imagePath:{type:String}
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

var Organization = mongoose.model('Organization', organizationSchema);
var Posting =mongoose.model('Posting', postingSchema);
var Event = mongoose.model('Event', eventSchema);

module.exports = {
    Organization: Organization,
    Posting: Posting,
    Event: Event
};

