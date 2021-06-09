const {CourseCart,Cart} = require("../models/cart")

// create course enrollment
exports.createOrder = (req,res)=>{
    req.body.order.user = req.profile
    const order = new CourseCart(req.body)
    order.save((err,data)=>{
        if(err){
            console.log(err)
            return res.status(403).json({
                err:"unable to create ORder"
            })
        }
        return res.status(200).json({
            msg:"sucessfully created the order",
            data
        })
    })
}