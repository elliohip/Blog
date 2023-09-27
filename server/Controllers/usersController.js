const asyncHandler = require("express-async-handler");
const User = require("../Models/User");
const fs = require("fs")
require('dotenv').config()

module.exports.get_user = asyncHandler(async (req, res, next) => {
    console.log(req.params);
    
    let user = await User.findById(req.params.user_id).exec();

    res.send(user);
    res.end();
});
module.exports.get_user_pfp = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.params.user_id).exec();

    if (!user.pfp_path) {
        res.sendFile("../user_pfps/default-profile.svg");
        res.end();
    } else {
        res.sendFile(user.pfp_path, (err) => {
            res.sendFile(process.env.DEFAULT_PFP_PATH);
        })
    }
    
});