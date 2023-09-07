var asyncHandler = require("express-async-handler");
const User = require("../Models/User");
const Article = require("../Models/Article");

require('dotenv').config();

const email_validator = require("deep-email-validator")

const { default: mongoose, get } = require("mongoose");

const jwt = require("jsonwebtoken");


module.exports.get_article_by_id = asyncHandler(async (req, res, next) => {

    console.log(req.params)

    await mongoose.connect(process.env.MONGO);

    let article_db = await Article.findById(req.params.article_id).exec();

    console.log(article_db)

    res.render("display_article", {
        article: article_db
    })
    
    next();
    await mongoose.disconnect();

});

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.get_create_article = async (req, res) => {
    // console.log(req.id)

    //console.log(process.env)

    await mongoose.connect(process.env.MONGO)

    let user_db = User.findById(req.id).exec();
    if (!user_db) {console.error("no user!!")};
    
    // await mongoose.disconnect();

    res.status(200).render("create_article", {
        user: user_db
    })
}

/**
 * posts a create article as an HTML document with the script tags filtered out using HTML Purifier
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.post_create_text_article = async (req, res) => {
    
    await mongoose.connect(process.env.MONGO);
    console.log("before find user");

    console.log(req.id);

    let current_user = await User.findById(req.id).exec();

    

    console.log(current_user)
    let article = new Article({
        author: req.id,
        author_pen_name: req.body.author_pen_name,
        title: req.body.title,
        content: req.body.article_content,
        description: req.body.description
    });
    console.log(article);

    await current_user.add_article(article._id);

    await article.save();

    await mongoose.disconnect();

    return res.render("user_dash");
}