const express = require('express');
const user = require('../models/user');
const jsonwebtoken = require('jsonwebtoken');

const router = express.Router();

router.post('/register',async(req,res) => {
    try {
        let {email,username,password} = req.body;
        if(!email || !username || !password) return res.json({success:false,message:"Required contents."});
    
        let newuser = await user.create({
            email,
            username,
            password,
            ip:req.ip,
            admin:false
        });
    
        return res.json({success:true,message:"Created user!",user:newuser});
    } catch (error) {
        return res.json({success:false,message:error});
    }
});

router.post('/login',async(req,res) => {
    let {email,password} = req.body;
    if(!email || !password) return res.json({success:false,message:"Required contents."});

    let myuser = await user.findOne({email});
    if(!myuser || myuser.password != password) return res.json({success:false,message:"Email or password incorrect!"});

    myuser.password = null;

    let token = await jsonwebtoken.sign(JSON.stringify({created:Date.now(),user:myuser}),process.env.SECRET);

    return res.json({success:true,message:"Login success!",token,user:myuser});
});

router.get('/user',async(req,res) => {
    /*let token = req.headers.authorization.split(" ")[1];
    let user = jsonwebtoken.verify(token,process.env.SECRET);
    if(!user) return res.json({success:false,message:"Not logged!",user});*/
    let requser = req.user;
    if(!requser) return res.json({success:false,message:"Not logged!"});

    res.json({success:true,message:"Logged!",user:requser});
});

router.post('/logout',(req,res) => {
    res.status(200).json({success:true,message:"banane aq"});
    req.user = null;
});

module.exports = router;
