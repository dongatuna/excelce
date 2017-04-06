var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require ('connect-flash');
var validator = require('express-validator');
var bluebird = require('bluebird');
var MongoStore =require('connect-mongo')(session);

mongoose.Promise = bluebird;

//var user = require('./models/user');
//including the passport configuration
require('./config/passport');

//route paths

var index = require('./routes/index');
var applicationRoutes = require('./routes/application');
var eventRoutes = require("./routes/event");
var jobRoutes = require("./routes/job");
var userRoutes = require("./routes/user");

//"C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe"

var app = express();
//Connect to mongodb
mongoose.connect("mongodb://localhost/expaddress");

//listen when connection is successfully made
mongoose.connection.once('open', function(){
    console.log("Connection has been made, now make fireworks...");
}).on('error', function(error){
    console.log("Connection error:", error);
});

// view engine setup
app.engine('.hbs', expressHbs({
  defaultLayout:'layout',
  extname:'.hbs',
  helpers: {
    ifIn: function(elem, list, options) {
      if(list.indexOf(elem) > -1) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  }
}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(session(
    {
        secret:'embabroswillmakeit',
        resave:false,
        saveUninitialized:false,
        store: new MongoStore({mongooseConnection: mongoose.connection}),
        cookie: {maxAge: 4320 * 60 *1000 }
    }
));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals.Notlogin =!req.isAuthenticated();
    //enable access of session variable to be available to routes and templates
    res.locals.session = req.session;
    next();
});

app.use("/users", userRoutes);
app.use('/application', applicationRoutes);
app.use('/event', eventRoutes);
app.use("/job", jobRoutes);

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Connect Flash
// error handler
app.use(function(err, req, res, next) {

  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
    // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

  //next();
});

module.exports = app;
