var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken")

var userController = require("../../Controllers/userController");
var articleListController = require("../../Controllers/articleListController")
var articleController = require("../../Controllers/articleController");

const { default: mongoose } = require('mongoose');

let multer = require("multer");

let storages = require("../../server_storage_logic/multer_controller");

/**
 * storage array and file system to store user profile pictues in the uploads folder, 
 * specified in storages options
 */
const pfp_uploads = multer({
    storage: storages.pfp_storage
});



/* GET home page. */
router.get('/', userController.authenticate_jwt, userController.get_user_home);

/**
 * logout of page
 */
router.post("/logout", userController.authenticate_jwt, userController.logout);

/**
 * user dashbord
 
router.get("/dashboard", userController.authenticate_jwt, userController.get_user_dash);
*/


router.get("/article/:article_id/like-article", userController.authenticate_jwt, articleController.add_like);
router.get("/article/:article_id/dislike-article", userController.authenticate_jwt, articleController.add_dislike);

router.get("/web_article/:web_article_id", userController.authenticate_jwt, articleController.get_web_article);

router.get("/dashboard/create_article", userController.authenticate_jwt, articleController.get_create_article);
router.post("/dashboard/create_article", pfp_uploads.array('article_file'), userController.authenticate_jwt, articleController.post_create_text_article);

router.get("/subscribed-articles", userController.authenticate_jwt, articleListController.get_by_subscribed);


router.get("/search_user", userController.authenticate_jwt, userController.get_search_user);

router.get("/recommended-articles", userController.authenticate_jwt, articleListController.get_by_trending);

module.exports = router;

