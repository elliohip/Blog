let mongoose = require("mongoose");

let Schema = mongoose.Schema


let articleSchema = new Schema({
    author_pen_name: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    title: {type: String, required: true},
    content: {type: String},
    likes: [{type: Schema.Types.ObjectId, ref: "User"}],
    dislikes: [{type: Schema.Types.ObjectId, ref: "User"}],
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    description: {type: String}
});

/**
 * gets the URL for this article
 */
articleSchema.virtual("url").get(function() {
    return "/user/" + String(this.author) + "/articles/" + this._id;
});


module.exports = mongoose.model('Article', articleSchema);