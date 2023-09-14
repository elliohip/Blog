let mongoose = require("mongoose");

let User = require("../../Models/");

module.exports = async function(user_id) {

    let user = await User.findOneAndUpdate({_id: user_id}, {role: 'user'}, {}).exec();

}