let path = require('path');

let output = {
    user_pfp: path.join(__dirname,"..", "/uploads", "/user_pfps"),
    web_article_temp_uploads: path.join(__dirname, '..', '/uploads'),
}


module.exports = output