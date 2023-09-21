let mongoose = require("mongoose")

let Schema = mongoose.Schema

const notificationSchema = new Schema({
    user_to: {type: Schema.Types.ObjectId, ref: "User"},
    user_from: {type: Schema.Types.ObjectId, ref: "User"},
    content: {type: String}
});

module.exports - mongoose.model("Notification", notificationSchema);