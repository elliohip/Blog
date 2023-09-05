var passportLocalMongoose = require("passport-local-mongoose");

let isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");

}
module.exports.is_logged_in = isLoggedIn;