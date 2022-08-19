const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:false
    },
    password:{
        type:String,
        required:true,
        unique:false
    },
    ip:{
        type:String,
        required:true,
        unique:false
    },
    admin:{
        type:Boolean,
        default:false,
        required:true,
        unique:false
    },
    createdAt:{
        type:Date,
        default:Date.now,
        required:true
    },
    updatedAt:{
        type:Date,
        default:Date.now,
        required:true
    }
},{versionKey:false});

const User = mongoose.model('User',userSchema);

module.exports = User;
