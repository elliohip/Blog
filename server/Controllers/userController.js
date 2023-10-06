var asyncHandler = require("express-async-handler");
const User = require("../Models/User");

const express = require("express")

require('dotenv').config();

let connect_db = require("../utils/connections/connect_db")

const email_validator = require("deep-email-validator")

const RefreshToken = require("../Models/RefreshToken")

const { default: mongoose, get } = require("mongoose");
const fs = require("fs");
const Jimp = require('jimp')
const jwt = require("jsonwebtoken");
const { get_all_articles } = require("../utils/article_lists/article_dashboards");
const Article = require("../Models/Article");
const FILE_PATHS = require("../utils/file_paths");
const path = require("path");


/**
 * sends a sign up result to the 
 */
module.exports.signup_post = asyncHandler(async (req, res, next) => {
    // await mongoose.connect(process.env.MONGO);
    console.log(process.env.MONGO);
    

    let user_object = {
      username: req.body.username,
      password: req.body.password,
      email: String(req.body.email)
    }
    if (user_object.username != null && user_object.password != null) {

        let check_user = await User.findOne({username: req.body.username}).exec();

        if (!check_user) {
    
            let email_validation_result = await email_validator.validate({
                email: user_object.email,
                validateSMTP: false,
                validateRegex: true,
                validateTypo: true
            });

            // console.log(email_validation_result.validators);

            if (!email_validation_result.valid) {
                return res.json({
                    message: "email is invalid",
                    style: process.env.STYLE_URL, 
                    js: process.env.JS_URL
                });
            }

            let password_validation = (req.body.password == req.body.confirm_password);

            if (!password_validation) {
                return res.json({
                    message: "password and confirm password doesnt match",
                    style: process.env.STYLE_URL, 
                    js: process.env.JS_URL
                });
            }

            let user = new User(user_object);

            console.log(user)
            // make webtoken
            await get_user_dashboard_object(user, res);

            await user.save();
        }
        else if (check_user) {

            res.json({
                message: "username exists",
                style: process.env.STYLE_URL, 
                js: process.env.JS_URL
            });
        }
    }
    // await mongoose.disconnect();
    next();

});

/**
 * posts the login data, securely submits data to authorize users using jwt
 */
module.exports.login_post = asyncHandler(async (req, res, next) => {

    
    console.log(req.body);

    console.log(req.url);

    // res.clearCookie("token")
    // res.clearCookie("refreshToken")

    if (req.body.username != null) {

        let user = await User.findOne({username: req.body.username}).exec();

        console.log(user);
        
        if (!user) {
            res.status(400).json({
                error: {
                    message: "no user by that username"
                }
            })
        }

        let are_match = await user.comparePassword(req.body.password);
        if (!are_match) {
            res.status(400).json({
                error: {
                    message: "passwords do not match"
                }
            })
        }

        await get_user_dashboard_object(user, res);
        
    }
    else {
        res.status(400).json({
            error: {
                message: "error"
            }
        })
    }

});

/**
 * 
 * redirects the response to the user homepage
 * 
 * @param {} user 
 * @param {express.Response} res
 * @param {} next
 */
async function get_user_dashboard_object(user, res, next) {

    res.header("Set-Cookies");

    const tokens = await user.generateJWT();
    const accessToken = tokens.access;
    const refreshToken = tokens.refresh;

    console.log(process.env)

    let containsToken = await RefreshToken.findOne({user: user._id}).exec()

    if (!containsToken) {
        let refresh_token_db = new RefreshToken({user: user._id, token: refreshToken});
        await refresh_token_db.save();
    }

    const options_access = {
        httpOnly: true,
        expires: new Date(Date.now() + Number(process.env.TOKEN_LIFESPAN))
    }

    const options_refresh = {
        httpOnly: true,
        expires: new Date(Date.now() + (process.env.REFRESH_LIFESPAN))
    }
    
    
    // res.set("Set-Cookie")
    res.cookie("token", accessToken, options_access).cookie("refreshToken", refreshToken, options_refresh).json({user: user}).status(200).end();
    
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {*} next 
 */
module.exports.authenticate_jwt = asyncHandler(async (req, res, next) => {
console.log(req.url);


    console.log(req.cookies);
    console.log(req.signedCookies);
    console.log(req.url);

    

    const token = String(req.cookies.token);
    const refresh_token =  String(req.cookies.refreshToken)

    console.log(token)
    if (!token) { return res.json({message: "no cookie"})}


    let user_tok = jwt.verify(token, process.env.EXPRESS_SECRET);
    let user_refresh = jwt.verify(refresh_token, process.env.EXPRESS_REFRESH_SECRET);

    let user = await User.findById(user_tok.id).exec();
    const containsRefreshTokens = await RefreshToken.findOne({user: user_tok.id}).exec();

    if (!containsRefreshTokens) {
        let new_tok_string = user.generateRefreshToken();
        let new_token = new RefreshToken({
            user: user_tok.id,
            token: new_tok_string
        });
        await new_token.save();
    }
    else {
        let new_tok_string = user.generateRefreshToken();
        console.log(user_tok);
        let new_token = await RefreshToken.findOneAndUpdate({user: user_tok.id}, {token: new_tok_string}, {new:true}).exec();
        console.log(new_token);
    }

    console.log(user_tok)

    req.id = user_tok.id;

    

    next();
});

module.exports.get_user_home = asyncHandler(async (req, res, next) => {

    let user_ob = jwt.verify(String(req.cookies.token), process.env.EXPRESS_SECRET);    
    console.log(user_ob);

    let user_db = await User.findById(req.id).exec();

    let homepage_object = {
        user: user_db,
        trending: await get_all_articles(),
        
    }

    res.json(homepage_object);
});

module.exports.logout = async function(req, res) {

    let token = jwt.verify(String(req.cookies.token), process.env.EXPRESS_SECRET)

    console.log(req);

    let refreshQuery = await RefreshToken.findOne({user: token.id}).exec();

    console.log(refreshQuery);

    if (!refreshQuery) {
        return res
        .clearCookie("token")
        .clearCookie("refreshToken")
        .status(200)
    }
    await RefreshToken.deleteOne({_id: refreshQuery._id}).exec();

    return res
    .clearCookie("token")
    .clearCookie("refreshToken")
    .status(200).redirect("/login")
}

/**
 * gets the deatils for a specific user based on the URL params
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
module.exports.get_user_detail = async (req, res) => {

    let user_id = req.params.user_id;

    let user_db = await User.findById(user_id).exec();

    let articles_db = [];

    for (let i = 0; i < user_db.articles.length; i++) {

        let new_article = await Article.findById(user_db.articles[i]).exec();
        articles_db.push(new_article);
        
    }

    res.json({
        user: user_db,
        
    });
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
module.exports.get_user_dash = async (req, res) => {

    console.log("fired get dashboard")

    let user_db = await User.findById(req.id);

    console.log(user_db.role);

    // TODO: CHANGE THIS TO NOT ALL, CHANGE TO RECCOMENDED
    let dashboard_object = {
        user: user_db,

    }
    console.log(dashboard_object);
    
    res.json(dashboard_object);
}

module.exports.get_search_user = asyncHandler(async (req, res, next) => {
    res.json({})
})

/**
 * controller for editing a users profile
 */
module.exports.edit_profile = asyncHandler(async (req, res, next) => {
    let update_object = {}
    console.log(req.body);
    if (req.file) {
        console.log(req.file.filename)
        console.log(req.file.path)

        if (req.file.mimetype.split("/")[1] != "jpeg") {
            Jimp.read(req.file.path, (err, image) => {
                if (err) {
                    console.log(err)
                    return;
                }
                console.log(path.resolve(__dirname + "/../uploads/user_pfps/" + path.parse(req.file.path).name + ".jpg"))
                image.write(path.resolve(__dirname + "/../uploads/user_pfps/" + path.parse(req.file.path).name + ".jpg"), (err, value) => {

                    if (err) {
                        console.log(err);
                    }
                });

                fs.rm(req.file.path, (err) => {
                    console.log(err);
                });
                
                update_object.has_pfp = true;
            })
        }
        else {
            update_object.has_pfp = true;
        }
    }
    if (req.body.username) {
        update_object.username = req.body.username
    }


    let user = await User.findByIdAndUpdate(req.id, update_object);


});

