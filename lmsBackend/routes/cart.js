const express = require('express');
const router= express.Router();

//required controllers
const {isAdmin,isAuthenticated,isSignedIn} = require('../controllers/auth')
const {getUserById, pushOrderInPurchaseList} = require('../controllers/user')
const {updateNoOfStudentsEnrolled} = require('../controllers/course')
const {createOrder} = require('../controllers/cart')

//params
router.param('userId',getUserById)


//actual routes goes here

//create
router.post("/order/create/:userId",isSignedIn,isAuthenticated,pushOrderInPurchaseList,updateNoOfStudentsEnrolled,createOrder)

module.exports = router