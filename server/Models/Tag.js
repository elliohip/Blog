let mongoose = require("mongoose")

let Schema = mongoose.Schema

let tagSchema = new Schema({
    name: {type: String}
});

module.exports = mongoose.model("Tag", tagSchema);
