let mongoose = require("mongoose");

let Schema = mongoose.Schema


let ArticleWebSchema = new Schema({
    article: {type: Schema.Types.ObjectId},
    file: {type: File}
});


module.exports = mongoose.model("WebArticle", ArticleWebSchema)