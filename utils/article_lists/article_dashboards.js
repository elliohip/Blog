require('dotenv').config()


const asyncHandler = require("express-async-handler");
const { default: mongoose } = require('mongoose');
const Article = require('../../Models/Article');



/**
 * returns all articles in the database
 */
module.exports.get_all_articles = asyncHandler(async () => {
    await mongoose.connect(process.env.MONGO);

    let articles = await Article.find({}).exec();
    await mongoose.disconnect();

    return articles;
});