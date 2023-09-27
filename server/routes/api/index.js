var express = require('express');
var router = express.Router({mergeParams: true});

let userController = require("../../Controllers/userController");
var articleListController = require("../../Controllers/articleListController")
let articleController = require("../../Controllers/articleController");

var asyncHandler = require("express-async-handler");

var fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {

  res.status(200);
  res.end();
  next();
});


router.get('/login', function(req, res, next) {
  res.status(200);

  // res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  // res.header('Access-Control-Allow-Credentials', true);
   
  res.end();
});


router.post('/login', userController.login_post);

router.post('/signup', userController.signup_post);

router.get("/articles/:article_id", articleController.get_article_by_id);

router.get('/signup', function(req, res, next) {
  res.status(200);
  res.end({
    style: process.env.STYLE_URL, 
    js: process.env.JS_URL
  });
  next();
});

router.get("/trending-articles", articleListController.get_by_trending);
router.get("/articles-by-liked", articleListController.get_by_liked);


module.exports = router;
