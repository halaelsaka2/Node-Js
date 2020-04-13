const express = require('express');
const router = express.Router();
const Post = require('../Model/post');
const User = require('../Model/users')
const ownerAuthorizationMiddleWare = require('../middlewares/ownerAuthorization');
const authenticationmiddleWare = require('../middlewares/authentication');
require('express-async-errors');

const {
    check,
    validationResult
} = require('express-validator')



module.exports = router;
router.get("/", async (req, res, next) => {
    const limit = req.query.limit || 10;
    const skip = req.query.skip || 0;

    const postList = await Post.find().skip(+skip).limit(+limit).populate('userId');
    res.status(200).json(postList);
});


router.post('/', async (req, res, next) => {

    const {
        userId,
        title,
        body,
        tags
    } = req.body;
    const post = new Post({
        userId,
        title,
        body,
        tags
    });
    await post.save();
    res.json(post)

})

router.patch('/:id', authenticationmiddleWare,
    ownerAuthorizationMiddleWare,
    async (req, res, next) => {

        const {
            id
        } = req.params;
        const {
            title,
            body,
            tags
        } = req.body;
        const post = await Post.findByIdAndUpdate(id, {
            title,
            body,
            tags
        }, {
            new: true,
            runValidators: true,
            omitUndefined: true
        });
        res.status(200).json({
            message: "Post Edit Succssfully",
            post
        })
    })

router.delete('/:id', async (req, res, next) => {
    const {
        id
    } = req.params;
    const post = await Post.findByIdAndDelete(id);
    res.status(200).json(post)
})