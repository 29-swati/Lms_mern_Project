const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

const subcourseSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        maxlength:1000,
        trim:true,
    },
    videos:{
        type:Array,
        default:[]
    },
    course:{
        type:ObjectId,
        ref:'Course',
        required:true,

    }
})
// const SubCourse = mongoose.model("SubCourse",subcourseSchema)
// console.log(SubCourse)
module.exports = mongoose.model("SubCourse",subcourseSchema)