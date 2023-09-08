var asyncHandler = require("express-async-handler");
const User = require("../Models/User");
const Article = require("../Models/Article");

require('dotenv').config();

const email_validator = require("deep-email-validator")

const { default: mongoose, get } = require("mongoose");

const jwt = require("jsonwebtoken");
const Web_Article = require("../Models/Web_Article");

const fs = require("fs")



module.exports.get_article_by_id = asyncHandler(async (req, res, next) => {

    console.log(req.params)

    await mongoose.connect(process.env.MONGO);

    let article_db = await Article.findById(req.params.article_id).exec();

    let web_article_db = await Web_Article.findOne({article: article_db._id}).exec();

    console.log(article_db)

    res.render("display_article", {
        web_article: web_article_db,
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

    console.log(req);

    console.log(req.files);
    

    // console.log(current_user)
    let article = new Article({
        author: req.id,
        author_pen_name: req.body.author_pen_name,
        title: req.body.title,
        content: req.body.article_content,
        description: req.body.description
    });

    await current_user.articles.push(article._id);
    console.log(current_user.isNew);
    await current_user.save();

    await article.save();

    if (req.files[0]) {

        console.log(req.files[0]);
        
        let web_article = new Web_Article({
            article: article._id,
            file: fs.readFileSync(req.files[0].path).toString() 
            
        });

        fs.rm(files[0].destination, + "/" + files[0].filename);
        


        await web_article.save();
    }

    console.log(article);

    

    await mongoose.disconnect();

    return res.render("user_dash");
};



module.exports.get_web_article = asyncHandler(async(req, res, next) => {
    await mongoose.connect(process.env.MONGO);

    let web_article = await Web_Article.findById(req.params.web_article_id).exec();

    console.log(web_article.file.destination);

    res.send(web_article.file);

    await mongoose.disconnect()

});


module.exports.add_like = asyncHandler(async(req, res, next) => {

    await mongoose.connect(process.env.MONGO);

    let user = await User.findById(req.id).exec();
    let article_db = await Article.findById(req.params.article_id).exec();

    let web_article_db = await Web_Article.findOne({article: article_db._id}).exec();

    article_db.likes.push(user._id);

    article_db.save();

    res.render("display_article", {
        article: article_db,
        web_article: web_article_db
    })

    await mongoose.disconnect();

});
