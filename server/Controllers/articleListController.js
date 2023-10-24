const asyncHandler = require("express-async-handler");

// const userController = require('./userController');

const article_lister = require("../utils/article_lists/article_dashboards");
const User = require("../Models/User");

module.exports.get_by_trending = asyncHandler(async (req, res, next) => {

    try {
        let articles = await article_lister.get_trending_articles();

        res.send(articles);
        res.end();

    } catch (err) {
        res.json(err).status(500);
    }

});

module.exports.get_by_subscribed = asyncHandler(async (req, res, next) => {

    try {
        console.log(req.id)
        let articles = await article_lister.get_subscribed_articles(req.id);

        res.send(articles);
        res.end();
    } catch (err) {
        res.json(err).status(500);
    }
});

module.exports.get_by_recommended = asyncHandler(async (req, res, next) => {
    try {
        console.log(req.id);

        let articles = await article_lister.get_recommended_articles(req.id);
        res.send(articles)
        res.end()
    } catch (err) {
        res.json(err).status(500);
    }
});

module.exports.get_by_liked = asyncHandler(async (req, res, next) => {
    try {
        let articles = await article_lister.get_liked_articles();
        res.send(articles)
        res.end();
    } catch (err) {
        res.json(err);
    }
})

module.exports.get_user_articles = asyncHandler(async (req, res, next) => {

    let article_ids = (User.findById(req.user_id)).exec().articles;

    res.json({article_ids});
})