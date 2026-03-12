const mongoose = require("mongoose")
const Schema = mongoose.Schema

const propertyImageSchema = new Schema({

    pgId:{
        type:mongoose.Types.ObjectId,
        ref:"pg_properties"
    },

    imageUrl:{
        type:String
    }

},{timestamps:true})

module.exports = mongoose.model("property_images",propertyImageSchema)