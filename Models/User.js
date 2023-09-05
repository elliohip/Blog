let mongoose = require("mongoose");

let passport_local_mongoose = require('passport-local-mongoose');

let bcrypt = require("bcrypt");

let jwt = require("jsonwebtoken");

require("dotenv").config();

// mongoose.connect(process.env.MONGO)


let Schema = mongoose.Schema;

const userSchema = new Schema({

    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true, select: false},
    articles: [{type: Schema.Types.ObjectId, ref: "Article"}],
    subscribed: [{type: Schema.Types.ObjectId, ref: "User"}],
    subscribers: [{type: Schema.Types.ObjectId, ref: "User"}],
    saved: [{type: Schema.Types.ObjectId, ref: "Article"}],
    liked: [{type: Schema.Types.ObjectId, ref: "Article"}],
    disliked: [{type: Schema.Types.ObjectId, ref: "Article"}],
    

});

/**
 * 
 * @param {} other 
 * @returns Promise
 */
userSchema.methods.comparePassword = async function(other) {
    console.log(this.password);
    let result = (await bcrypt.compare(other, this.password));
    console.log(result);
    return result;
}

userSchema.methods.generateJWT = function() {

    let jwt_payload = {
        id: this._id
    };

    console.log(process.env.EXPRESS_REFRESH_SECRET);
    console.log(process.env.EXPRESS_SECRET);

    const refresh_token = jwt.sign(jwt_payload, process.env.EXPRESS_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_LIFESPAN
    })

    const access_token = jwt.sign(jwt_payload, process.env.EXPRESS_SECRET, {
        expiresIn: 3600
    });

    return {
        refresh: refresh_token,
        access: access_token
    }

}

userSchema.methods.generateRefreshToken = function() {
    let jwt_payload = {
        id: this._id
    };

    let refresh_token = jwt.sign(jwt_payload, process.env.EXPRESS_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_LIFESPAN
    })
    
    return refresh_token;

}

userSchema.plugin(passport_local_mongoose);

userSchema.pre("save", async function (next) {
    if (!(this.isModified('password'))) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.virtual("url").get(function() {
    return "/user/" + this._id;
});




module.exports = mongoose.model("User", userSchema);