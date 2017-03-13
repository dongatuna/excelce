var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var SALT_FACTOR = 10;
//this is a model of the User
var userSchema = new Schema({
    email: {type: String, required:true, unique:true},
    username:{type: String, required:true, unique:true},
    password: {type: String, required:true},
    role: {type: String, enum: ['organization', 'provider'], required:true},
    createdAt:{type: Date, default:Date.now}
});
//this is a model for job posted by user employer
var postingSchema = new Schema({
    organization: [userSchema],
    name: {type:String, required:true},
    title: {type:String, required:true},
    description: {type:String, required:true},
    requirements: [],
    imagePath:{type:String}
});
//this is a model for the event posted by the user employer
var eventSchema = new Schema({
    organization: [userSchema],
    presenter: {type:String, required:true},
    topic: {type:String, required:true},
    description: {type:String, required:true},
    start:{type: Date},
    end:{type:Date},
    imagePath:{type:String}
});
//this is a model for the application posted by user provider
var applicationSchema = new Schema ({
    provider:[userSchema],
    description: {type:String, required:true},
    certifications: [],
    imagePath:{type:String}
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

var User = mongoose.model('User', userSchema);
var Posting =mongoose.model('Posting', postingSchema);
var Event = mongoose.model('Event', eventSchema);
var Application = mongoose.model('Application', applicationSchema);


module.exports = {
    User: User,
    Posting: Posting,
    Event: Event,
    Application:Application
};

