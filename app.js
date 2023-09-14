var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connect_db = require("./utils/connections/connect_db");

require("dotenv").config();

var passport = require('passport')
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require("passport-local-mongoose");

const cors = require("cors");

var User = require("./Models/User");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRouter = require("./routes/user");
var guestRouter = require('./routes/guest');
let writerRouter = require("./routes/writer");

var app = express();

connect_db.connectToDatabase();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')(
  {
    secret: process.env.EXPRESS_SECRET,
    resave: false, 
    saveUninitialized: false
  }
));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

// Routing 

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/guest', guestRouter);
app.use("/writer", writerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

process.on('SIGINT', connect_db.shutdown);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
