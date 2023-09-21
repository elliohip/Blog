require('dotenv').config()


const asyncHandler = require("express-async-handler");
const { default: mongoose } = require('mongoose');
const Article = require('../../Models/Article');



/**
 * returns all articles in the database
 */
module.exports.get_all_articles = async () => {
    let articles = await Article.find({}).exec();
    return articles;
};

module.exports.get_trending_articles = async () => {
    let articles = await Article.find({}).exec();
    return articles;
}