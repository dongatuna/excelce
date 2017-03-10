var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require ('connect-flash');
var validator = require('express-validator');
var bluebird = require('bluebird');
var Handlebars = require('handlebars');
mongoose.Promise = bluebird;

//including the passport configuration
require('./config/passport');

//route paths
var index = require('./routes/index');

var providerRoutes = require('./routes/provider');
var organizationRoutes = require('./routes/organization');

var app = express();

mongoose.connect('mongodb://dongatuna:Embabros33@ds157349.mlab.com:57349/excelce');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout:'layout', extname:'.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({secret:'embabroswillmakeit', resave:true, saveUninitialized:true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users/provider', providerRoutes);

app.use('/users/organization', organizationRoutes);
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

  res.locals.login =req.isAuthenticated();

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
