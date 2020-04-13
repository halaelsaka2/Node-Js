const errorMiddleWare = require('../helpers/customError')
const Post = require('../Model/post');
require('express-async-errors');

module.exports = async (req, res, next) => {

    const {
        params: {
            id: postId
        },
        user: {
            id: userId
        }
    } = req;
    const post = await Post.findById(req.params.id);
    if (!post.userId.equals(userId)) throw errorMiddleWare('Not Authrized', 403, 'you are not Authrized here')

    next();

}