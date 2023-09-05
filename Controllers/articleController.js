var asyncHandler = require("express-async-handler");
const User = require("../Models/User");
const Article = require("../Models/Article");

require('dotenv').config();

const email_validator = require("deep-email-validator")

const { default: mongoose, get } = require("mongoose");

const jwt = require("jsonwebtoken");


module.exports.get_article_by_id = asyncHandler(async (req, res, next) => {

    console.log(req.params)

    let article = req.params.article_id;

});

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.get_create_article = async (req, res) => {
    conaole.log(req.id)

    await mongoose.connect(process.env.MONGO)

    let user_db = User.findById(req.id).exec();
    if (!user_db) {console.error("no user!!")};
    
    await mongoose.disconnect();

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
module.exports.post_create_article = async (req, res) => {
    console.log(req.body);
    
}