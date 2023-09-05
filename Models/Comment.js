let mongoose = require("mongoose");

let Schema = mongoose.Schema

/**
 * Schema for a single comment
 */
let commentSchema = new Schema({
    article: {type: Schema.Types.ObjectId, ref: "Article"}, 
    author: {type: Schema.Types.ObjectId, ref: "Author"}, 
    content: {type: String},
    replies: [{type: Schema.Types.ObjectId, ref: "Comment"}]
});

/**
 * 
 */
commentSchema.virtual('url').get(function() {

    return "/user/" + this.author + "/article/" + this.article + "/comment" + this._id;
});

module.exports = mongoose.model("Comment", commentSchema);

