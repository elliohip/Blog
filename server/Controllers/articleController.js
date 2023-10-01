var asyncHandler = require("express-async-handler");
const User = require("../Models/User");
const Article = require("../Models/Article");

require('dotenv').config();

const email_validator = require("deep-email-validator")

const { default: mongoose, get } = require("mongoose");

const jwt = require("jsonwebtoken");
const Web_Article = require("../Models/Web_Article");

const fs = require("fs");



const createDomPurify = require("dompurify");
const {JSDOM} = require("jsdom");



module.exports.get_article_by_id = asyncHandler(async (req, res, next) => {

    console.log(req.params)

    let article_db = await Article.findOneAndUpdate({_id: req.params.article_id}, {
        $inc: {page_views: 1}
    }, {
        new: true
    }).exec();

    let web_article_db = await Web_Article.findOne({article: article_db._id}).exec();

    console.log(article_db)
   

    res.send({
        web_article: web_article_db,
        article: article_db,
        
    });
    res.end();
    
    // next();
    

});

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.get_create_article = async (req, res) => {
    // console.log(req.id)

    //console.log(process.env)


    let user_db = await User.findById(req.id).exec();
    if (!user_db) {console.error("no user!!")};
    

    res.status(200).json({
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

        let string_file = fs.readFileSync(req.files[0].path).toString();
        
        let web_article = new Web_Article({
            article: article._id,
            file: string_file
            
        });

        fs.rm(req.files[0].path, (err) => {
            console.log("completed")
            
        });
        


        await web_article.save();
    }

    console.log(article);

    



    return res.json({
        user: current_user,
        
    });
};



module.exports.get_web_article = asyncHandler(async(req, res, next) => {


    let web_article = await Web_Article.findById(req.params.web_article_id).exec();

    console.log(web_article.file.destination);



    res.send(web_article.file);

    

});


module.exports.add_like = asyncHandler(async(req, res, next) => {



    

    let user = await User.findById(req.id).exec();
    let article_db = await Article.findById(req.params.article_id).exec();
    let web_article_db = await Web_Article.findOne({article: article_db._id}).exec();

    if (!(article_db.likes.includes(user._id))) {
        await article_db.updateOne({
            $push: {likes: user._id}
        }).exec();

        await user.updateOne({
            $push: {likes: article_db._id}
        }).exec();
        
        if (article_db.dislikes.includes(user._id)) {
            console.log(article_db.dislikes);

            await article_db.updateOne({
                $pull: {dislikes: user._id}
            }, {}).exec();

            console.log("article likes " + article_db.likes);
            console.log("user liked " + user.liked);

            await user.updateOne({
                $pull: {disliked: article_db._id},
            }, {}).exec();

            console.log("user disliked " + user.disliked);

            
        }

        
    } else {

        console.log("article likes " + article_db.likes);

        await article_db.updateOne({
            $pull: {likes: user._id}
        }, {}).exec();
        console.log("article likes " + article_db.likes);
        console.log("user liked " + user.liked);
        await user.updateOne({
            $pull: {liked: article_db._id},
        }, {}).exec();

        console.log("user liked " + user.liked);

        
        
        console.log("article likes " + article_db.likes);
        console.log("user liked " + user.liked);
    }

    



    res.json({
        article: article_db,
        web_article: web_article_db,
        
    });

});

module.exports.add_dislike = asyncHandler(async (req, res, next) => {
    
    

    let user = await User.findById(req.id).exec();
    let article_db = await Article.findById(req.params.article_id).exec();
    let web_article_db = await Web_Article.findOne({article: article_db._id}).exec();

    if (!(article_db.dislikes.includes(user._id))) {

        await article_db.updateOne({
            $push: {dislikes: user._id}
        }).exec();

        await user.updateOne({
            $push: {dislikes: article_db._id}
        }).exec();

        
        if (article_db.likes.includes(user._id)) {

            console.log(article_db.likes);

            await article_db.updateOne({
                $pull: {likes: user._id}
            }, {}).exec();
            console.log("article likes " + article_db.likes);
            console.log("user liked " + user.liked);
            await user.updateOne({
                $pull: {liked: article_db._id},
            }, {}).exec();

            console.log("user liked " + user.liked);
        }
        
    }
    else {
        await article_db.updateOne({
            $pull: {dislikes: user._id}
        }, {new:true}).exec();

        console.log("article likes " + article_db.likes);
        console.log("user liked " + user.liked);
        await user.updateOne({
            $pull: {disliked: article_db._id},
        }, {new:true}).exec();
    }

    

    res.json({
        article: article_db,
        web_article: web_article_db,
        
    });
})