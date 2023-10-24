const asyncHandler = require("express-async-handler");
const User = require("../Models/User");
const fs = require("fs");
const path = require("path");
require('dotenv').config()

const bcrypt = require('bcrypt')

module.exports.get_user = asyncHandler(async (req, res, next) => {
    console.log(req.params);
    
    let user_db = await User.findById(req.params.user_id).exec();

    let user = {
        username: user_db.username,
        email: user_db.email,
        articles: user_db.articles,
        subscribed: user_db.subscribed,
        subscribers: user_db.subscribers,
        saved: user_db.saved,
        liked: user_db.liked,
        disliked: user_db.disliked,
        notifications: user_db.notifications,
        role: user_db.role,
        has_pfp: user_db.has_pfp,
        description: user_db.description,
        _id: user_db._id
    }
    res.send(user);
    res.end();
});
console.log(__dirname)
module.exports.get_user_pfp = asyncHandler(async (req, res, next) => {
    //let user = await User.findById(req.params.user_id).exec();
    //console.log(user);
    if (req.params.user_id) {

        let pfp_path = path.resolve(path.join(__dirname, "..", "uploads", "user_pfps", req.params.user_id+ ".jpg"));

        console.log(path.resolve(path.join(__dirname, "..", "uploads", "user_pfps", req.params.user_id+ ".jpg")));

        fs.stat(pfp_path, (err, stats) => {
            if (err) {
                res.sendFile(path.resolve(path.join(__dirname, "..", "uploads", "user_pfps","profile-round-1342-svgrepo-com.svg")), (err) => {
                    console.log(err);
                });
                console.log(err);
            }
            res.sendFile(pfp_path, (err) => {
                console.log(err);
            });
        });
    }
    
});

