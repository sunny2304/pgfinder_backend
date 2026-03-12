const mongoose = require("mongoose")
const Schema = mongoose.Schema

const pgPropertySchema = new Schema({

    pgName:{
        type:String,
        required:true
    },

    landlordId:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },

    city:{
        type:String
    },

    area:{
        type:String
    },

    address:{
        type:String
    },

    rent:{
        type:Number
    },

    roomType:{
        type:String,
        enum:["single","double","triple"]
    },

    amenities:{
        type:[String]
    },

    description:{
        type:String
    },

    available:{
        type:Boolean,
        default:true
    }

},{timestamps:true})

module.exports = mongoose.model("pg_properties",pgPropertySchema)