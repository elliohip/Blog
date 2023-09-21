let mongoose = require("mongoose");

let Schema = mongoose.Schema


let articleSchema = new Schema({
    author_pen_name: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
    likes: [{type: Schema.Types.ObjectId, ref: "User"}],
    dislikes: [{type: Schema.Types.ObjectId, ref: "User"}],
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    description: {type: String}, 
    web_article: {type: Schema.Types.ObjectId, ref: "Web_Article"},
    page_views: {type: Number}
}, {timestamps: true,
 toJSON: {virtuals: true}});

articleSchema.methods.add_view = async function() {
    await this.model("Article").findOneAndUpdate({_id: this._id}, {$inc: {page_views: 1}}, {new: true})
}

/**
 * gets the URL for this article
 */
articleSchema.virtual("url").get(function() {
    return "/user/" + String(this.author) + "/articles/" + this._id;
});


module.exports = mongoose.model('Article', articleSchema);