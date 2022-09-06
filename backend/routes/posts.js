const express = require('express');
const user = require('../models/user');
const post = require('../models/post');
const comment = require('../models/comment');

const router = express.Router();

router.get('/',async(req,res) => {
    let {page} = req.query;
    let myuser = req.user;
    
    if(!page || page <= 0) page = 1;

    if(!myuser){
        let posts = await post.find({})
            .populate("author","-password -ip")
            .sort("-createdAt")
            .skip(10*(page-1))
            .limit(10)

        await post.count().exec((err,count) => {
            res.json({success:true,message:"I find posts.",posts,count,page});
        });

        return;
    }

    let users = await user.find({});
    let fallowings = [];

    users.forEach((e) => {
        let find = e.fallowers.find((b) => b.toString() == req.user._id);
        if(find) fallowings.push(e._id);
    });

    let posts = await post.find({author: {$in:fallowings}})
        .populate("author","-password -ip")
        .sort("-createdAt")
        .skip((page-1)*10)
        .limit(10);

    res.json({success:true,message:"I find posts.",posts,page});
});

router.get('/all',async(req,res) => {
    let {page} = req.query;
    if(!page) page = 1;
    if(page <= 0) page = 1;

    let posts = await post.find({})
        .populate("author")
        .sort("-createdAt")
        .skip(10*(page-1))
        .limit(10)

    posts.forEach((post) => {
        post.author.password = null;
    });

    await post.count().exec((err,count) => {
        res.json({success:true,message:"I find posts.",posts,count,page});
    });

    return;
});

router.post('/create',async(req,res) => {
    let {content} = req.body;
    let myuser = req.user;

    if(!content) return res.json({success:false,message:"Missing fields."});

    if(!myuser) return res.json({success:false,message:"You need login."});

    let mypost = await post.create({
        content:content,
        author:myuser._id
    });

    if(!mypost) return res.json({success:false,message:'Missing fields.'});

    return res.json({success:true,message:'Post created.',post:mypost});
});


router.get('/:id/like',async(req,res) => {
    let myuser = req.user;
    if(!myuser) return res.json({success:false,message:"You need login!"});

    let {id} = req.params;
    if(!id) return res.json({success:false,message:"Not found post!"});

    let mypost = await post.findOne({_id:id});

    if(!mypost) return res.json({success:false,message:"Not found post!"});

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

router.get('/:id/delete',async(req,res) => {

    let myuser = req.user;
    if(!myuser) return res.json({success:false,message:"You need login!"});

    let {id} = req.params;
    if(!id) return res.json({success:false,message:"Not found post!"});

    let mypost = await post.findOne({_id:id});

    if(!mypost) return res.json({success:false,message:"Not found post!"});

    if(mypost.author.toString() != req.user._id.toString() && !req.user.admin) return res.json({success:false,message:"You are not post author!"});

    await mypost.remove();

    return res.json({success:true,message:"Deleted post!"});

});

router.post('/:id/comments/create',async(req,res) => {

    let myuser = req.user;
    if(!myuser) return res.json({success:false,message:"You need login!"});

    let {id} = req.params;
    if(!id) return res.json({success:false,message:"Not found post!"});

    let {content} = req.body;
    if(!content) return res.json({success:false,message:'Missing fields.'});

    let mypost = await post.findOne({_id:id});
    if(!mypost) return res.json({success:false,message:"Post not found!"});

    let mycomment = await comment.create({
        content:content,
        post:mypost._id,
        author:myuser._id
    });

    return res.json({success:true,message:"Created!",mypost,mycomment});

});

router.get('/:id',async(req,res) => {
    try {
        let {id} = req.params;
        if(!id) return res.json({success:false,message:"Required contents."});
    
        let mypost = await post.findOne({_id:id}).populate("author");
        if(!mypost) return res.json({success:false,message:"Not found post!"});

        let comments = await comment.find({}).populate("author").sort("-createdAt");

        let cs = [];

        comments.forEach((c) => {
            if(c.post.toString() == mypost._id.toString()){
                cs.push(c);
            }
        });

        mypost.author.password = null;
    
        return res.json({success:true,message:"Finded post!",post:mypost,comments:cs});
    } catch (error) {
        return res.json({success:false,message:"Not found post!"});
    }
});

module.exports = router;
