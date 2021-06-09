const mongoose = require('mongoose')
const {ObjectId}=mongoose.Schema

const CourseCartSchema = new mongoose.Schema({
    course:{
        type:ObjectId,
        ref:"Course"
    },
    name:String,
    price:Number
})
const CourseCart = mongoose.model("CourseCart",CourseCartSchema)


const cartSchema = new mongoose.Schema({
    //to mention course array
    courses:[CourseCartSchema],
    amount:{
        type:Number
    },
    transaction_id:{},
    date_Purcahse:{
        Date
    },
    user:{
        type:ObjectId,
        ref:"User"
    }
    
})

const Cart = mongoose.model("Cart",cartSchema)
module.exports={Cart,CourseCart}