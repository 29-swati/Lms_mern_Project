const mongoose = require("mongoose")
const mongoosastic = require('mongoosastic')
const {ObjectId} = mongoose.Schema
const SubCourse = require('./subcourse').schema
// console.log(SubCourse)
const _id = '5d273f9ed58f5e7093b549b0';
const courseSchema = new mongoose.Schema(
    // { _id: mongoose.ObjectId }, { versionKey: false },
    {
    cname:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        trim:true,
        maxlength:3000,
        required:true
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    students_count:{
        type:Number,
        default:0
    },
    cimg:{
        type:String
    },
    material:{
        type:Array,
        default:[],
        es_type:'string'
    },
    tags:{
        type:Array,
        default:[],
        es_type:'string'
    },
    //to do
    category:{
        type:ObjectId,
        ref:"Category",
        required:true,
        es_type:'string'
    },
    sub:{
        type:[SubCourse],
        // default:[{}]
    },
    // {
    //     type:Array,
    //     default:[],
    //     es_type:'text'
    // },
    student_id:{
        type:Array,
        ref:"User",
        es_type:'string'
    }
},{timestamps:true})

// courseSchema.plugin(mongoosastic,{
//     type:'_doc',
//     "host": "https://search-lms-search-service-7b5djyyusztub3tftjknqxqyqm.us-east-1.es.amazonaws.com",
//     "port": 443
// })
module.exports = mongoose.model("Course",courseSchema,'courses')
