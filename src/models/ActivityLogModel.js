const mongoose = require("mongoose")
const Schema = mongoose.Schema

const activityLogSchema = new Schema({

    userId:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },

    activity:{
        type:String
    }

},{timestamps:true})

module.exports = mongoose.model("activity_logs",activityLogSchema)