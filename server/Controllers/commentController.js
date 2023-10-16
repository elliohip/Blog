const asyncHandler = require("express-async-handler")

module.exports.get_create_reply = (req, res) => {

}

module.exports.post_create_reply = (req, res) => {

}

module.exports.get_replies = asyncHandler(async (req, res, next) => {
    console.log(req.params) 
});