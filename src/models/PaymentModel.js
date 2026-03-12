const mongoose = require("mongoose")
const Schema = mongoose.Schema

const paymentSchema = new Schema({

    bookingId:{
        type:mongoose.Types.ObjectId,
        ref:"bookings"
    },

    userId:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },

    amount:{
        type:Number
    },

    paymentMethod:{
        type:String,
        enum:["upi","card","netbanking"]
    },

    paymentStatus:{
        type:String,
        enum:["success","failed","pending"]
    }

},{timestamps:true})

module.exports = mongoose.model("payments",paymentSchema)