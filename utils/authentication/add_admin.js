let mongoose = require("mongoose");

let User = require("../../Models/");

module.exports = async function(user_id) {
    await mongoose.connect();
    let user = await User.findOneAndUpdate({_id: user_id}, {role: 'admin'}, {}).exec();
    await mongoose.disconnect();
}