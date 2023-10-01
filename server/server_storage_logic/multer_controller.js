const multer = require("multer");

module.exports.pfp_storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../uploads/user_pfp');
     },
    filename: function (req, file, cb) {
        cb(null , req.id);
    }
});

module.exports.web_article_storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../uploads/temp_storage/web_article');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});