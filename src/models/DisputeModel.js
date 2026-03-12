const mongoose = require("mongoose")
const Schema = mongoose.Schema

const disputeSchema = new Schema({

    bookingId:{
        type:mongoose.Types.ObjectId,
        ref:"bookings"
    },

    userId:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },

    description:{
        type:String
    },

    status:{
        type:String,
        enum:["open","resolved"],
        default:"open"
    }

},{timestamps:true})

module.exports = mongoose.model("disputes",disputeSchema)