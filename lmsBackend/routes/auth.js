const express = require('express')
const router = new express.Router();
const {check} = require('express-validator')

const {signup,signout,signin,isAuthenticated,isAdmin,isSignedIn} = require('../controllers/auth')


//singup route
router.post('/signup',
[
    // check('name','minimum length is 3').isLength({min:3}),
    check('email','email is required').isEmail(),
    check('password','password must have one upper case ,special characters').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")],
signup);


//signin route
router.post('/signin',[
    check('email','email is required').isEmail(),
    check('password','password is required and must be of min length 3')
],signin)


//signout route
router.get('/signout',signout)


//test route
router.get('/testroute',isSignedIn,isAuthenticated,isAdmin,signout)
router.get('/test',isSignedIn,(req,res)=>{
    res.json(req.auth)
    console.log(req.auth)
})
module.exports = router;