const express = require('express');
var mongoose = require("mongoose");
const router = express.Router();
const User = require('../Model/users');
const Post = require('../Model/post');
const validationMiddleWare = require('../middlewares/validationMiddleWare')
const authenticationmiddleWare = require('../middlewares/authentication');
require('express-async-errors');

const {
    check,
    validationResult
} = require('express-validator');

module.exports = router;

router.get("/",authenticationmiddleWare,
 async (req, res, next) => {
    const usersList = await User.find()
    const firstNameList = usersList.map(user => user.firstName)
    res.status(200).json(usersList);
});

router.post('/register', validationMiddleWare(
    check('passward')
    .isLength({
        min: 5
    })
    .withMessage('must be at least 5 chars long')
    .matches(/\d/)
    .withMessage('must contain a number')
), async (req, res, next) => {

    const {
        userName,
        passward,
        age,
        firstName
    } = req.body;
    const user = new User({

        userName,
        passward,
        age,
        firstName
    });

    await user.save();
    res.json(user);
})

router.post('/login', async (req, res, next) => {
    const {userName,passward} = req.body;
    const user = await User.findOne({userName}).populate('posts');
    if (!user) throw new Error('wrong data');
    const isMatch = await user.comparePassword(passward);
    if (!isMatch) throw new Error('Wrong username or password');
    //sign
    const token = await user.generateToken();
    res.json({
        user,
        token
    })
})




router.patch('/:id', authenticationmiddleWare, validationMiddleWare(
    check('passward')
    .isLength({
        min: 5
    })
    .withMessage('must be at least 5 chars long')
    .matches(/\d/)
    .withMessage('must contain a number')
),
 async (req, res, next) => {
        id = req.user.id;
    const {
        userName,
        passward,
        age,
        firstName
    } = req.body;
    const user = await User.findByIdAndUpdate(id, {
        $set: {
            userName,
            passward,
            age,
            firstName
        }
    }, {
        new: true,
        runValidators: true,
        omitUndefined: true
    });
    res.status(200).json(user)
})

router.delete('/:id', authenticationmiddleWare, async (req, res, next) => {
    const id= req.user.id;
    const user = await User.findByIdAndDelete(id);
    res.status(200).json(user)
})