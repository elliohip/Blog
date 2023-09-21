let mongoose = require("mongoose");

let Schema = mongoose.Schema


let ArticleWebSchema = new Schema({
    article: {type: Schema.Types.ObjectId, ref: "Article"},
    file: {type: Schema.Types.Mixed}
});


module.exports = mongoose.model("WebArticle", ArticleWebSchema)