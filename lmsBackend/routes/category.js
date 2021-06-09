const express = require("express")
const router = express.Router();

//required functions in these files are
const {getAllCategry,getCategoryById,updateCategory,getCategory,createCategory,removeCategory} = require('../controllers/category')
const {isAdmin,isAuthenticated,isSignedIn} = require('../controllers/auth')
const {getUserById} = require('../controllers/user')

//params
router.param('userId',getUserById)
router.param('categoryId',getCategoryById)

//actual route goes here

//create a category (by ADMIN)
router.post('/category/create/:userId',isSignedIn,isAuthenticated,isAdmin,createCategory)

//reading all or single categories (By Everyone)
router.get('/category/:categoryId/',getCategory)
router.get('/categories/',getAllCategry)

//update category (By ADMIN)
router.put('/category/:categoryId/:userId',isSignedIn,isAuthenticated,isAdmin,updateCategory)

//delete category (By ADMIN)
router.delete('/category/:categoryId/:userId',isSignedIn,isAuthenticated,isAdmin,removeCategory)

module.exports = router;