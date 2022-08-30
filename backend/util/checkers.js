const jsonwebtoken = require('jsonwebtoken');
const user = require('../models/user');

const checkuser = async (req,res,next) => {
    if(!req.headers || !req.headers.authorization) return next();

    let token = req.headers.authorization.split(" ")[1];
    if(!token) return next();

    let cacheuser = jsonwebtoken.verify(token,process.env.SECRET);
    if(!cacheuser) return next();

    let myuser = await user.findOne({
        _id:cacheuser.user._id
    });

    if(!myuser) return next();

    myuser.password = null;

    req.user = myuser;

    next();
}

module.exports = {checkuser};
