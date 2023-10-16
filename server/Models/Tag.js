let mongoose = require("mongoose")

let Schema = mongoose.Schema

let tagSchema = new Schema({
    name: {type: String},
    articles: [{type: mongoose.Types.ObjectId, ref: "Article"}]
});

module.exports = mongoose.model("Tag", tagSchema);
