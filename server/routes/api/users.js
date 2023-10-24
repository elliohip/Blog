var express = require('express');
var router = express.Router();
var usersController = require("../../Controllers/usersController")
var articleListController = require("../../Controllers/articleListController");

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
});

router.get('/:user_id', usersController.get_user)

router.get('/:user_id/get-pfp', usersController.get_user_pfp);

router.get('/:user_id/articles', articleListController.get_user_articles)

module.exports = router;
