const User = require('../Model/users')
const CustomError = require('../helpers/customError');
require('express-async-errors');


module.exports = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) throw CustomError('Please Loginn First', 401, "you didn't Login");
    const currentUser = await User.getUserFromToken(token);
    req.user = currentUser;
    next();
}