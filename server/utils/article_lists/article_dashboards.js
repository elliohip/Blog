require('dotenv').config()


const asyncHandler = require("express-async-handler");
const { default: mongoose } = require('mongoose');
const Article = require('../../Models/Article');
const User = require('../../Models/User');



/**
 * returns all articles in the database
 */
module.exports.get_all_articles = async () => {
    let articles = await Article.find({}).exec();
    return articles;
};

/**
 * TODO: IMPLEMENT TO NOT JUST LIST ARTICLES
 * 
 * returns the top 6 recommended articles based on logged in user's id
 * 
 * @param {*} id 
 * @returns 
 */
module.exports.get_recommended_articles = async (id) => {
    let articles = await Article.find({}).exec();
    return articles;
};

/**
 * returns three of the articles that are most popular
 * TODO: IMPLEMENT 
 * @returns {[]}
 */
module.exports.get_trending_articles = async () => {
    let articles = await Article.find({}).exec();
    return articles;
}

module.exports.get_liked_articles = async() => {
    let articles = await Article.find({}).exec();
    articles.sort((a, b) => {
        if (a.likes.length > b.likes.length) {
            return 1;
        }
        else if (a.likes.length < b.likes.length) {
            return -1;
        }
        else {
            return 0;
        }
    });
    return articles;
}

/**
 * 
 * @param {mongoose.Schema.Types.ObjectId} id 
 * @returns {[]} returns the latest 3 articles for a user based on their subscriber list, 
 * user given by the id param
 */
module.exports.get_subscribed_articles = async (id) => {
    console.log("subscribed_id \n \n \n \n \n" + id);
    let user = await User.findById(id).exec();

    if (user.subscribed.length == 0) {
        return await Article.find({}).exec();
    }
    let articles = [];
    for(let i = 0; i < 3; i++) {
        let subscribed_to = await User.findById(user.subscribed[i]).exec();
        let latest_article = await Article.findById(subscribed_to.articles[subscribed_to.articles.length]).exec();
        articles.push(latest_article);

    }

    return articles;
}