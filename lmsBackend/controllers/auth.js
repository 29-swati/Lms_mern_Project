const User = require('../models/user')
const {check,validationResult} = require('express-validator')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
require('dotenv')
const expressJwt = require('express-jwt')


exports.signup=(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()
        })
    }
    newUser = new User(req.body);
    // console.log(newUser.password)
    // console.log(newUser.confirmPassword)
    if(newUser.confirmPassword!=newUser.password){
        return res.status(400).json({
                err:"passwd and cnfm passwd does not match"
            })
    }
    newUser.save((err,user)=>{
        if(err || !newUser){
            console.log(err)
            return res.status(400).json({
                err:"NOT ABLE TO STORE USER IN DB"
            })
        }
        return res.json(user)
    })
}


exports.signin=((req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            err: errors.array()[0].msg
        })
    }
    const {email,password} = req.body;
    User.findOne({email},async (err,user)=>{
        if(err||!user){
            return res.status(400).json({
                error:"Email not exist"
            })
        }
        var ismatch=await bcrypt.compare(password,user.password)
        if(!ismatch){
            return res.status(401).json({
                error:"Email or Password does not match"
            })
        }
        //create token for authorization, stroing token in user cookie
        const token = await jwt.sign({_id:user._id},process.env.SECRET)
        console.log("token",token)

        //put generated token in cookie 
        res.cookie('jwt_token',token,{
            expires: new Date(Date.now() + 900000),
            httpOnly: true,
            secure: false 
        })
        return res.json({token,user})
    })
})


exports.signout=(req,res)=>{
    //to clear cookies here
    console.log(req.cookies)
    res.clearCookie('jwt_token')
    res.json({
        msg:"user signout succesfully"
    })
}

//protected routes
exports.isSignedIn = expressJwt({
    secret:process.env.SECRET,
    algorithms: ['HS256'],
    userProperty:"auth"
})

//custom middleware
exports.isAuthenticated=(req,res,next) =>{
    const tkn = req.cookies.jwt_token;
    console.log('cook:',req.cookies.jwt_token)
    console.log('tkn:',tkn)
    // console.log(tkn)
    // console.log(req.profile)
    const verifyUser=jwt.verify(tkn,process.env.SECRET)
    console.log(verifyUser)
    if(!verifyUser){
        return res.status(403).json({
            err:"ACESS DENIED"
        })
    }
    next()
}

exports.isAdmin=(req,res,next)=>{
    console.log('hello')
    console.log('BODYY--',req.profile)
    console.log(req.auth)
    if(req.profile.role===0){
        return res.status(403).json({
            error: "You are not Admin,Acess DENIED"
        })
    }
    next();
}