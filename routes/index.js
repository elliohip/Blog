var express = require('express');
var router = express.Router();

let userController = require("../Controllers/userController");

var asyncHandler = require("express-async-handler");

var fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
  let requirefn = require;
  res.render("sign_up", {
    style: process.env.STYLE_URL, 
    js: process.env.JS_URL
  })
  res.status(200);

  next();
});

router.get('/login', function(req, res, next) {
  res.render("login", {
    style: process.env.STYLE_URL, 
    js: process.env.JS_URL
  });
  res.status(200);
  next()
});

router.post('/login', userController.login_post);

router.post('/signup', userController.signup_post);

router.get('/signup', function(req, res, next) {
  res.status(200);
  res.render('sign_up', {
    style: process.env.STYLE_URL, 
    js: process.env.JS_URL
  });
  next();
});

module.exports = router;
