var express = require('express');
const User = require('../Models/User');
var router = express.Router();

const multer = require("multer");


var userController = require("../Controllers/userController");

var articleController = require("../Controllers/articleController");

const uploads = multer({dest: __dirname + "/../uploads"});

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});


router.get("/create_article", userController.authenticate_jwt, articleController.get_create_article);

router.post("/create_article", uploads.array('article_file'), userController.authenticate_jwt, articleController.post_create_text_article);



module.exports = router;
