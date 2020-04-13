var mongoose = require('mongoose');
const Post = require('../Model/post');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const CustomError = require('../helpers/customError');
require('dotenv').config();

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    passward: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 13,
        required: false
    },
    firstName: {
        type: String,
        minlength: 3,
        maxlength: 15
    }
}, {
    collection: "users",
    toJSON: {
        virtuals: true,
        transform: doc => {
            return _.pick(doc, ['userName', 'fullName', 'id','passward', 'posts'])
        }
    }
})

userSchema.pre('save', async function () {
    const userInstance = this;
    if (this.isModified('passward')) {
        userInstance.passward = await bcrypt.hash(userInstance.passward, saltRounds);
    }
})

userSchema.methods.comparePassword = function (plainPassword) {
    const userInstance = this;
    const p=userInstance.passward;
    return bcrypt.compare(plainPassword, p);
}


const sign = util.promisify(jwt.sign)
const verify = util.promisify(jwt.verify)

// jwt.verify()


userSchema.methods.generateToken = function (expiresIn = '30m') {
    const userInstance = this;
    return sign({ userId: userInstance.id }, jwtSecret, {expiresIn})
}


userSchema.statics.getUserFromToken= async function (token) {
    const User = this;
    const payload = await verify(token,jwtSecret);
    const currentUser = await User.findById(payload.userId);
    if(!currentUser) throw CustomError('Are You Sure From Your Data ... This user Not Found ',404)
    return currentUser;
     
}


userSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "userId",
    options: {
        limit: 10
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;