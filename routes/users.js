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

    res.render('user',{user:myuser});
});


module.exports = router;
