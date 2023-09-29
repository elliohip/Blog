const multer = require("multer");

module.exports.pfp_storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../uploads');
     },
    filename: function (req, file, cb) {
        cb(null , req.id);
    }
});
