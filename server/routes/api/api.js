var express = require('express');
var router = express.Router({mergeParams: true});
var indexRouter = require("./index");
var guestRouter = require("./guest");
var userRouter = require("./user");
var writerRouter = require("./writer");
const path = require("path")



router.use("/", indexRouter);
router.use("/guest", guestRouter);
router.use("/user", userRouter);
router.use("/writer", writerRouter);



module.exports = router;
