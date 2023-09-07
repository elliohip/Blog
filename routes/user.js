var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken")

var userController = require("../Controllers/userController");

var articleController = require("../Controllers/articleController");

const { default: mongoose } = require('mongoose');

/* GET home page. */
router.get('/', userController.authenticate_jwt, userController.get_user_home);

router.post("/logout", userController.authenticate_jwt, userController.logout);

router.get("/search_user/:user_id", userController.authenticate_jwt, userController.get_user_detail);

router.get("/dashboard", userController.authenticate_jwt, userController.get_user_dash);

router.get("/article/:article_id", userController.authenticate_jwt, articleController.get_article_by_id);

router.get("/dashboard/create_article", userController.authenticate_jwt, articleController.get_create_article);
router.post("/dashboard/create_article", userController.authenticate_jwt, articleController.post_create_text_article);




module.exports = router;
