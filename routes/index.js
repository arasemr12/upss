const express = require('express');
const {notrequirelogin,requirelogin} = require('../util/routeroptions');
const user = require('../models/user');
const post = require('../models/post');

const router = express.Router();

router.get('/',async(req,res) => {
    let {page} = req.query;
    if(!page) page = 1;
    if(page <= 0) page = 1;
    let posts = await post.find({})
     .populate("author")
     .sort("-createdAt")
     .skip(10*(page-1))
     .limit(10)
    post.count().exec((err,count) => {
        if(err) throw err;
        res.render('index',{posts,count,page});
    });
});

router.get('/register',notrequirelogin,(req,res) => {
    res.render('register');
});

router.post('/register',notrequirelogin,async(req,res) => {
    let {email,username,password} = req.body;

    let my = await user.create({
        email,
        username,
        password
    })
    //res.render('login',{message:{success:true,body:"You have successfully registered"}});
    res.render('redirect',{message:{success:true,body:"You have successfully registered"},url:"/login",time:3000});
});

router.get('/login',notrequirelogin,(req,res) => {
    res.render('login');
});

router.post('/login',notrequirelogin,async(req,res) => {
    let {email,password} = req.body;

    let my = await user.findOne({
        email
    });
    if(!my || my.password != password) return res.render('redirect',{message:{success:false,body:"Email or password incorrect!"},url:"/login",time:3000});
    req.session.userid = my._id;
    return res.render('redirect',{message:{success:true,body:"Login successful!"},url:"/",time:3000});
});

router.get('/logout',requirelogin,(req,res) => {
    req.session.destroy();
    res.render('redirect',{message:{success:true,body:"You have successfully logged out!"},url:"/login",time:3000});
});

router.get('/contact',(req,res) => {
    res.render('contact');
});

module.exports = router;
