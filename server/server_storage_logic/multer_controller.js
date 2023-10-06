const multer = require("multer");
const path = require("path")
module.exports.pfp_storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '..', '/uploads', '/user_pfps'));
     },
    filename: function (req, file, cb) {

        console.log(req.id + "." + file.mimetype.split('/')[1]);
        cb(null , req.id + "." + file.mimetype.split('/')[1]);
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