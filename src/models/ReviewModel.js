const mongoose = require("mongoose")
const Schema = mongoose.Schema

const reviewSchema = new Schema({

    userId:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },

    pgId:{
        type:mongoose.Types.ObjectId,
        ref:"pg_properties"
    },

    rating:{
        type:Number,
        min:1,
        max:5
    },

    reviewText:{
        type:String
    }

},{timestamps:true})

module.exports = mongoose.model("reviews",reviewSchema)