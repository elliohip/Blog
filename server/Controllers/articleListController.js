const asyncHandler = require("express-async-handler");

// const userController = require('./userController');

const article_lister = require("../utils/article_lists/article_dashboards");

module.exports.get_trending = asyncHandler(async (req, res, next) => {

    try {
        let articles = await article_lister.get_trending_articles();

        res.send(articles);
        res.end();

    } catch (err) {
        res.json(err).status(500);
    }

})