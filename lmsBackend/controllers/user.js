const User = require('../models/user')
const Cart = require('../models/cart')
var mongoose = require('mongoose');
// var ObjectId = require('mongoose').Types.ObjectId;




//get user by id
exports.getUserById=async(req,res,next,id)=>{
    var newObjectId=new mongoose.Types.ObjectId(id);
    console.log('OBJID-Before:',newObjectId)
    // var idToSearch = new ObjectId(id);
    var params={
    '_id':newObjectId
}

    console.log('OBJID-after:',newObjectId)
    console.log('PARAM',params)

    await User.findById(id).exec((err,user)=>{
        if(err){
            console.log(err)
            return res.status(400).json({
                err:"user not found"
            })
        }
        console.log('user',user)
        req.profile = user
        console.log('req.profile',req.profile)
        next()
    })
}

//get particular user
exports.getUser =(req,res)=>{
    req.profile.password=undefined;
    req.profile.createdAt=undefined;
    req.profile.password=undefined;
    return res.json(req.profile)

}

//update any user
exports.updateUser=(req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true,useFindAndModify:false},(err,user)=>{
            if(err){
                return res.status(400).json({
                    err:"USER NOT FOUND"
                })
            }
            user.password=undefined;
            res.json(user)
        }
    )
}

//course list
exports.pushOrderInPurchaseList = (req,res,next)=>{
    let purchaseList = []
    req.body.cart.courses.forEach(course=> {
        purchaseList.push({
            _id:course.id,
            name:course.name,
            description:course.description,
            amount:req.body.cart.amount,
            transaction_id:req.body.cart.transaction_id
        })
    });
    User.findByIdAndUpdate((
        {_id:req.profile._id},
        {$push:{coursePurchase:purchaseList}},
        {new:true},
        (err,data)=>{
            if(err){
                return res.status(403).json({
                    err:"unable to save the PURCHASES"
                })
            }
            next()
        }
    ))
}

//for user Purchase List
exports.userPurchaseList=(req,res)=>{
   Cart.find({user:req.profile._id}).exec((err,order)=>{
       if(err){
           return res.status(403).json({
               err:"No order in this account"
           })
       }
       return res.json(order)
   }) 
}

//get order by id 
exports.getOrderById=(req,res,next,id)=>{
    Cart.findById(id).exec((err,data)=>{
        if(err){
            return res.status(400).json({
                err:"order not found in Db"
            })
        }
        req.order = order
        next()
    })
}