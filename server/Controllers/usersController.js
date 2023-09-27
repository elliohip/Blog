const asyncHandler = require("express-async-handler");
const User = require("../Models/User");



module.exports.get_user = asyncHandler((req, res, next) => {
    console.log(req.params);
    
    let user = User.findById(req.params.user_id).exec();

    res.send(user);
    res.end();
})