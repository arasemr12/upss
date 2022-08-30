const express = require('express');
const user = require('../models/user');
const jsonwebtoken = require('jsonwebtoken');
const post = require('../models/post');

const router = express.Router();

router.get('/:id',async(req,res) => {
    try {
        let {id} = req.params;
        if(!id) return res.json({success:false,message:"Required contents."});
    
        let newuser = await user.findOne({_id:id});
    
        if(!newuser) return res.json({success:false,message:"Not found user!"});

        newuser.password = null;

        let posts = await post.find({author:newuser._id})
            .populate("author")
            .sort("-createdAt")
    
        return res.json({success:true,message:"Finded user!",user:newuser,posts});
    } catch (error) {
        return res.json({success:false,message:"Not found user!"});
    }
});


router.get('/:id/fallow',async(req,res) => {
    let me = req.user;
    if(!me) return res.json({success:false,message:"You need login!"});

    let {id} = req.params;
    if(!id) return res.redirect('/');

    let myuser = await user.findOne({_id:id});
    if(!myuser) return res.json({success:false,message:"User not found!"});

    let find = myuser.fallowers.find((e) => e.toString() === me._id.toString());

    let fallowing = false;

    if(find){
        myuser.fallowers.remove(me._id);
        fallowing = false;
    }else{
        myuser.fallowers.push(me._id);
        fallowing = true;
    }

    await myuser.save();

    return res.json({success:true,message:"Fallow changed.",fallowing});

});


module.exports = router;
