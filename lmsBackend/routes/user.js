const express = require('express')
const router = express.Router()

const {getUser,updateUser,getUserById} = require('../controllers/user')
const {isAdmin,isAuthenticated,isSignedIn} = require('../controllers/auth')

//router params
router.param("userId",getUserById)

//actual router

//get particular user
router.get("/user/:userId",isSignedIn,isAuthenticated,getUser)

//update user
router.put("/user/:userId",isSignedIn,isAuthenticated,updateUser)

//course list of user

module.exports=router;