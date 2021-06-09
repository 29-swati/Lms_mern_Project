const express = require('express');
const router = express.Router();

const {createSubCourse,getSubCourseById,deleteSubCourse,updateSubCourse,getSubCourse,deleteSubVideo} = require('../controllers/subcourse')
const {getUserById} = require('../controllers/user')
const {isSignedIn,isAdmin,isAuthenticated}  = require('../controllers/auth')
const {getCourseById} = require('../controllers/course')

//params
router.param('userId',getUserById)
router.param('courseId',getCourseById)
router.param('subCourseId',getSubCourseById)

//create subCourse (BY ADMIN)
// router.get('/subcourse/create/:userId',isSignedIn,isAuthenticated,isAdmin,function(req,res){
//     console.log(res)
// }
// )

//create subcourse BY (ADMIN)
router.post('/sub/create/:courseId/:userId',isSignedIn,isAuthenticated,isAdmin,createSubCourse)

//get subcourse
router.get('/sub/:courseId/:subCourseId/:userId',isSignedIn,isAuthenticated,getSubCourse)

//delete subCourseVideo
router.delete('/sub/video/:courseId/:subCourseId/:userId',isSignedIn,isAuthenticated,isAdmin,deleteSubVideo)

//delete subCOurse
router.delete('/sub/delete/:courseId/:subCourseId/:userId',isSignedIn,isAuthenticated,isAdmin,deleteSubCourse)

//update subCOurse
router.put('/sub/update/:courseId/:subCourseId/:userId',isSignedIn,isAuthenticated,isAdmin,updateSubCourse)

module.exports=router