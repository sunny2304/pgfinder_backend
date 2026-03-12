const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({

    firstName:{
        type:String,
        required:true
    },

    lastName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:["user","admin","landlord"],
        default:"user"
    },

    profilePic:{
        type:String,
        default:""
    },

    status:{
        type:String,
        enum:["active","inactive","deleted","blocked"],
        default:"active"
    }

},{timestamps:true})

module.exports = mongoose.model("users",userSchema)