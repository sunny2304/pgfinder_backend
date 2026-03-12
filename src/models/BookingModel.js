const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bookingSchema = new Schema({

    tenantId:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },

    pgId:{
        type:mongoose.Types.ObjectId,
        ref:"pg_properties"
    },

    checkInDate:{
        type:Date
    },

    checkOutDate:{
        type:Date
    },

    bookingStatus:{
        type:String,
        enum:["pending","confirmed","cancelled"],
        default:"pending"
    }

},{timestamps:true})

module.exports = mongoose.model("bookings",bookingSchema)