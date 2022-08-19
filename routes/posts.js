const express = require('express');
const {notrequirelogin,requirelogin} = require('../util/routeroptions');
const post = require('../models/post');

const router = express.Router();

router.post('/create',requirelogin,async(req,res) => {
    let userid = req.session.userid;
    let {content} = req.body;

    if(!userid || !content) return res.json({success:false,message:'Missing fields.'});

    let mypost = await post.create({
        content:content,
        author:userid
    });

    if(!mypost) return res.json({success:false,message:'Missing fields.'});

    return res.json({success:true,message:'Post created.',post:mypost});
    //res.render('redirect',{message:{success:true,body:"Post created successfully!"},url:`/posts/${mypost._id}`,time:3000});
    //res.render('login',{message:{success:true,body:"You have successfully registered"}});
});

router.get('/:id',async(req,res) => {
    let {id} = req.params;
    if(!id) return res.redirect('/');

    let mypost = await post.findOne({_id:id}).populate("author");

    if(!mypost) return res.render('redirect',{message:{success:false,body:"Post not found!"},url:`/`,time:3000});

    res.render('post',{post:mypost});

    //res.send(mypost);
});

router.get('/:id/like',requirelogin,async(req,res) => {
    let {id} = req.params;
    if(!id) return res.redirect('/');

    let mypost = await post.findOne({_id:id});

    if(!mypost) return res.json({success:false,message:"Post not found!"});

    console.log(mypost.likes)

    let find = mypost.likes.find(like => like.toString() == req.user._id.toString());

    if(find){
        mypost.likes.remove(req.user._id);
        await mypost.save();
        return res.json({success:true,message:"Unliked.",liked:false,newlikes:mypost.likes.length});
    }else{
        mypost.likes.push(req.user._id);
        await mypost.save();
        return res.json({success:true,message:"Liked.",liked:true,newlikes:mypost.likes.length});
    }

});

router.get('/:id/delete',requirelogin,async(req,res) => {
    let {id} = req.params;
    if(!id) return res.redirect('/');

    let mypost = await post.findOne({_id:id});

    if(!mypost) return res.redirect(`/`);

    if(mypost.author.toString() != req.user._id.toString() && !req.user.admin) return res.redirect(`/posts/${id}`);

    await mypost.remove();

    return res.redirect(`/`);

});


module.exports = router;
