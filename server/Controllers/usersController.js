const asyncHandler = require("express-async-handler");
const User = require("../Models/User");
const fs = require("fs");
const path = require("path");
require('dotenv').config()

module.exports.get_user = asyncHandler(async (req, res, next) => {
    console.log(req.params);
    
    let user = await User.findById(req.params.user_id).exec();

    res.send(user);
    res.end();
});

module.exports.get_user_pfp = asyncHandler(async (req, res, next) => {
    // let user = await User.findById(req.params.user_id).exec();

    if (req.params.user_id) {
        res.sendFile(path.resolve(path.join(__dirname, "../uploads/user_pfps/default-pfp.png")),(err) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log("sent file")
            }
        });
    }

    let pfp_path = path.resolve(path.join(__dirname, "..", "uploads", "user_pfps", req.params.user_id+ ".jpg"));

   console.log(path.resolve(path.join(__dirname, "..", "uploads", "user_pfps", req.params.user_id+ ".jpg")));

    fs.stat(pfp_path, (err, stats) => {
        if (err) {
            console.log(err);
        }
        res.sendFile(pfp_path, (err) => {
            console.log(err);
        });
    });
    
});