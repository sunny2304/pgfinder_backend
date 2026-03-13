const mongoose = require("mongoose")
const Schema = mongoose.Schema

const messageSchema = new Schema({

    senderId:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },

    receiverId:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },

    pgId:{
        type:mongoose.Types.ObjectId,
        ref:"pg_properties"
    },

    message:{
        type:String
    }

},{timestamps:true})

module.exports = mongoose.model("messages",messageSchema)