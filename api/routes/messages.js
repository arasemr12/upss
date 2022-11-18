const express = require('express');
const message = require('../models/message');
const user = require('../models/user');
const jsonwebtoken = require('jsonwebtoken');

const router = express.Router();

router.use(async(req,res,next) => {
    if(!req.user) return res.json({success:false,message:"You need login!"});
    next();
});

router.get('/all/',async(req,res) => {
    let messages = await message.find({});
    let usermsg = [];

    messages.forEach((msg) => {
        if(msg.sending.toString() == req.user._id || msg.author.toString() == req.user._id){
            usermsg.push(msg);
        }
    });

    return res.json(usermsg);
});

router.post('/create/',async(req,res) => {
    let {content,sending} = req.body;
    if(!content || !sending) return res.json({success:false,message:"Missing fields!"});

    let msg = await message.create({
        author:req.user._id,
        content,
        sending
    });

    return res.json({success:true,msg});
});

router.get('/:id/',async(req,res) => {
    let {id} = req.params;
    if(!id) return res.json({success:false,message:"Missing fields!"});

    let author = await user.findOne({_id:id});
    if(!author) return res.json({success:false,message:"Not found!"});

    let messages = await message.find({}).populate("author").populate("sending");
    let usermsg = [];

    messages.forEach((msg) => {
        if(msg.sending._id.toString() == req.user._id.toString() && msg.author._id.toString() == id){
            usermsg.push(msg);
        }
        if(msg.sending._id.toString() == id && msg.author._id.toString() == req.user._id.toString()){
            usermsg.push(msg);
        }
        /*if(msg.sending._id.toString() == id.toString() || msg.author._id.toString() == id){
            usermsg.push(msg);
        }*/
    });

    return res.json({success:true,msg:usermsg,author:author});
});

module.exports = router;
