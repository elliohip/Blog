
var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken")

var userController = require("../Controllers/userController");
var articleListController = require("../Controllers/articleListController")
var articleController = require("../Controllers/articleController");

const { default: mongoose } = require('mongoose');

const multer = require("multer");

const uploads = multer({dest: __dirname + "/../uploads"});



/* GET home page. */
router.
get('/', userController.authenticate_jwt, userController.get_user_home);

router.post("/logout", userController.authenticate_jwt, userController.logout);

// router.get("/trending-articles", userController.authenticate_jwt, articleListController.get_trending);

router.get("/search_user/:user_id", userController.authenticate_jwt, userController.get_user_detail);

router.get("/dashboard", userController.authenticate_jwt, userController.get_user_dash);

// router.get("/articles/:article_id", userController.authenticate_jwt, articleController.get_article_by_id);


router.get("/article/:article_id/like-article", userController.authenticate_jwt, articleController.add_like);
router.get("/article/:article_id/dislike-article", userController.authenticate_jwt, articleController.add_dislike);

router.get("/web_article/:web_article_id", userController.authenticate_jwt, articleController.get_web_article);

router.get("/dashboard/create_article", userController.authenticate_jwt, articleController.get_create_article);
router.post("/dashboard/create_article", uploads.array('article_file'), userController.authenticate_jwt, articleController.post_create_text_article);


router.get("/search_user", userController.authenticate_jwt, userController.get_search_user);



module.exports = router;