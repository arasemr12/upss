const express = require('express');
const user = require('../models/user');
const post = require('../models/post');
const tag = require('../models/tag');
const jsonwebtoken = require('jsonwebtoken');

const router = express.Router();

router.get('/all',async(req,res) => {
    let tags = await tag.find({}).sort("-createdAt");
    return res.json({success:true,message:"I find tags..",tags});
});

router.get('/:id/posts',async(req,res) => {
    let {id} = req.params;
    if(!id) return res.json({success:false,message:"Required params.."});
    let result = [];

    let posts = await post.find({}).populate("tags").populate("author","-password -ip");

    for(let p of posts){
        let find = p.tags.find((b) => b.name == id);
        if(find) result.push(p);
    }

    result.sort((a,b) => b.createdAt - a.createdAt);

    return res.json({success:true,message:"Finded posts!",result});

});

module.exports = router;
