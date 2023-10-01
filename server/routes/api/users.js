var express = require('express');
var router = express.Router();
var usersController = require("../../Controllers/usersController")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:user_id', usersController.get_user)

router.get('/:user_id/get-pfp', usersController.get_user_pfp);

module.exports = router;
