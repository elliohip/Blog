let mongoose = require("mongoose");

let Schema = mongoose.Schema


const RefreshTokenSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    token: {type: String}
});

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);