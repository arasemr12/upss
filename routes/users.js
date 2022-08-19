const express = require('express');
const {notrequirelogin,requirelogin} = require('../util/routeroptions');
const user = require('../models/user');
const post = require('../models/post');

const router = express.Router();

router.get('/:id',async(req,res) => {
    let {id} = req.params;
    if(!id) return res.redirect('/');

    let myuser = await user.findOne({_id:id});

    if(!myuser) return res.render('redirect',{message:{success:false,body:"User not found!"},url:`/`,time:3000});

    myuser.posts = [];

    let sa = await post.find({});

    sa.forEach((e) => {
        if(e.author.toString() == myuser._id) {
            myuser.posts.push(e);
        }
    });

    res.render('user',{myuser});
});

router.get('/:id/delete',requirelogin,async(req,res) => {
    if(!req.user.admin) return res.redirect('/');
    let {id} = req.params;
    if(!id) return res.redirect('/');

    let myuser = await user.findOne({_id:id});

    if(!myuser) return res.render('redirect',{message:{success:false,body:"User not found!"},url:`/`,time:3000});

    await user.deleteOne({_id:id});

    let posts = await post.find({});

    posts.forEach(async(e) => {
        if(e.author.toString() === myuser._id.toString()){
            await post.deleteOne({_id:e._id});
        }
    });

    return res.render('redirect',{message:{success:true,body:"User deleted!"},url:`/`,time:3000});
});


module.exports = router;
