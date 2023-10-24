let mongoose = require("mongoose");

let Schema = mongoose.Schema

/**
 * Schema for a single comment
 */
let commentSchema = new Schema({
    article: {type: Schema.Types.ObjectId, ref: "Article", required: true}, 
    author: {type: Schema.Types.ObjectId, ref: "User", required: true}, 
    content: {type: String, required: true},
    replies: [{type: Schema.Types.ObjectId, ref: "Comment"}]
});

/**
 * 
 */
commentSchema.virtual('url').get(function() {

    return "/user/" + this.author + "/article/" + this.article + "/comment" + this._id;
});

commentSchema.pre('remove', async function() {
    let this_id = this._id;
    await Promise.all([
        this.model('Article').updateMany({comments: this_id}, {$pull: {comments: this_id}}).exec(),
        this.model('User').updateMany({comments: this_id}, {$pull: {comments: this_id}}).exec()
    ]);
});

module.exports = mongoose.model("Comment", commentSchema);

