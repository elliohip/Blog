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
    let user = await User.findById(req.params.user_id).exec();

    if (!user.has_pfp) {
        try {
            console.log(path.isAbsolute(path.join(__dirname, "../uploads/user_pfps/default-pfp.png")));
            res.sendFile(path.resolve(path.join(__dirname, "../uploads/user_pfps/default-pfp.png")),
            (err) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("sent file")
                }
            })
        } catch(err) {
            console.log(err);
        }
        
    } else {
        res.sendFile(process.env.DEFAULT_PFP_PATH + req.params.user_id, (err) => {
            res.send(err);
        });
        
    }
    
});