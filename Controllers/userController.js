var asyncHandler = require("express-async-handler");
const User = require("../Models/User");

require('dotenv').config();

const email_validator = require("deep-email-validator")

const RefreshToken = require("../Models/RefreshToken")

const { default: mongoose, get } = require("mongoose");

const jwt = require("jsonwebtoken");
const { get_all_articles } = require("../utils/article_lists/article_dashboards");

/**
 * sends a sign up result to the 
 */
module.exports.signup_post = asyncHandler(async (req, res, next) => {
    await mongoose.connect(process.env.MONGO);
    console.log(process.env.MONGO);
    

    let user_object = {
      username: req.body.username,
      password: req.body.password,
      email: String(req.body.email)
    }
    if (user_object.username != null && user_object.password != null) {

        let check_user = await User.findOne({username: req.body.username});

        if (!check_user) {
    
            let email_validation_result = await email_validator.validate({
                email: user_object.email,
                validateSMTP: false,
                validateRegex: true,
                validateTypo: true
            });

            // console.log(email_validation_result.validators);

            if (!email_validation_result.valid) {
                return res.render("sign_up", {message: "email is invalid"});
            }

            let password_validation = (req.body.password == req.body.confirm_password);

            if (!password_validation) {
                return res.render("sign_up", {message: "password and confirm password doesnt match"});
            }

            let user = new User(user_object);

            console.log(user)
            // make webtoken
            await get_user_dashboard_object(user, res);

            await user.save();
        }
        else if (check_user) {

            res.render("sign_up", {message: "username exists"})
        }
    }
    await mongoose.disconnect();
    next();

});

/**
 * posts the login data, securely submits data to authorize users
 */
module.exports.login_post = asyncHandler(async (req, res, next) => {

    console.log(req.body)

    if (req.body.username != null) {
        await mongoose.connect(process.env.MONGO);
        let user = await User.findOne({username: req.body.username}).exec();

        console.log(user);
        
        if (!user) {
            res.status(400).render("login", {message: "no user by that username"});
        }

        let are_match = await user.comparePassword(req.body.password);
        if (!are_match) {
            res.status(400).redirect("/login");
        }

        await get_user_dashboard_object(user, res);
        
    }
    else {
        res.status(400).render("login", {message: "username not sent"});
    }
    await mongoose.disconnect();

});

/**
 * 
 * redirects the response to the user homepage
 * 
 * @param {} user 
 * @param {Response} res
 * @param {} next
 */
async function get_user_dashboard_object(user, res) {

    // already connected from other function
    // await mongoose.connect(process.env.MONGO)

    const tokens = await user.generateJWT();
    const accessToken = tokens.access;
    const refreshToken = tokens.refresh;
    
    let refresh_token_db = new RefreshToken({user: user._id, token: refreshToken});


    const options_access = {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.TOKEN_LIFESPAN)
    }

    const options_refresh = {
        httpOnly: true,
        expiresIn: process.env.REFRESH_LIFESPAN
    }

    
    await refresh_token_db.save();
        
    res.status(200).cookie("token", accessToken, options_access).cookie("refreshToken", refreshToken, options_refresh).redirect('/user');
    // next()
}

/**
 * 
 * @param {Request} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports.authenticate_jwt = asyncHandler(async (req, res, next) => {

    const token = String(req.cookies.token);
    const refresh_token = String(req.cookies.refreshToken)

    console.log(token)

    if (!token) { return res.json({message: "no cookie"})}

    let user_tok = jwt.verify(token, process.env.EXPRESS_SECRET);
    let user_refresh = jwt.verify(refresh_token, process.env.EXPRESS_REFRESH_SECRET);

    await mongoose.connect(process.env.MONGO);

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
        console.log(user_tok)
        let new_token = await RefreshToken.findOneAndUpdate({user: user_tok.id}, {token: new_tok_string}, {new:true}).exec();
        console.log(new_token);
    }

    console.log(user_tok)

    req.id = user_tok.id;

    await mongoose.disconnect();

    next();
});

module.exports.get_user_home = asyncHandler(async (req, res, next) => {

    await mongoose.connect(process.env.MONGO)
    console.log("fired user home function")
    console.log(req.cookies.token);
    let user = jwt.verify(String(req.cookies.token), process.env.EXPRESS_SECRET);

    console.log("after user");


    console.log(user.id);

    let user_db = await User.findById(user.id).exec();

    console.log(user_db);

    let homepage_object = {
        id: req.id,
        recommended: await get_all_articles()
    }

    console.log(homepage_object);

    res.render("user_view", homepage_object);
});

module.exports.logout = async function(req, res) {

    let token = jwt.verify(String(req.cookies.token), process.env.EXPRESS_SECRET)

    console.log(req);

    await mongoose.connect(process.env.MONGO);

    let refreshQuery = await RefreshToken.findOne({user: token.id}).exec();

    console.log(refreshQuery);

    if (!refreshQuery) {
        return res
        .clearCookie("token")
        .clearCookie("refreshToken")
        .status(200)
    }
    await RefreshToken.deleteOne({_id: refreshQuery._id}).exec();

    await mongoose.disconnect();

    return res
    .clearCookie("token")
    .clearCookie("refreshToken")
    .status(200).redirect("/login")
}

/**
 * gets the deatils for a specific user based on the URL params
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.get_user_detail = async (req, res) => {
    let user_id = req.params.user_id;
    await mongoose.connect(process.env.MONGO);

    let user_db = User.findById(user_id).exec();

    await mongoose.disconnect();

    res.render("user_details", {
        user: user_db
    });
}

module.exports.get_user_dash = async (req, res) => {

    console.log("fired get dashboard")


    // TODO: CHANGE THIS
    let dashboard_object = {
        id: req.id,
        recommended: get_all_articles()
    }
    console.log(dashboard_object);
    
    res.render("user_dash", dashboard_object);
}