var express = require('express');
var router = express.Router();

let userController = require("../Controllers/userController");

var asyncHandler = require("express-async-handler");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("sign_up");
  next();
});

router.get('/login', function(req, res, next) {
  res.render("login");
  next()
});

router.post('/login', userController.login_post);

router.post('/signup', userController.signup_post);

router.get('/signup', function(req, res, next) {
  res.render('sign_up')
});

module.exports = router;
