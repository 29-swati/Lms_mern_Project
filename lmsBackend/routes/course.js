const express = require('express')
const router = express.Router();
const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')
const uuid = require("uuid").v4;
const path = require('path')
const Course = require('../models/course')
const elasticsearch = require('elasticsearch')

const client = new elasticsearch.Client({
   hosts:"https://search-lms-search-service-7b5djyyusztub3tftjknqxqyqm.us-east-1.es.amazonaws.com",
    connectionClass: require('http-aws-es'),
    amazonES:{
        region:'us-east-1',
        accessKey:process.env.AWS_ID,
        secretKey:process.env.AWS_SECRET
    }
});


client.ping({
     requestTimeout: 30000,
 }, function(error) {
 // at this point, eastic search is down, please check your Elasticsearch service
     if (error) {
         console.error('Elasticsearch cluster is down!');
     } else {
         console.log('Everything is ok');
     }
 });

// const stream = Course.synchronize();

// Course.createMapping(function(err, mapping){  
//   if(err){
//     console.log('error creating mapping (you can safely ignore this)');
//     console.log(err);
//   }else{
//     console.log('mapping created!');
//     console.log(mapping);
//   }
// });

// var count = 0;

// stream.on('data',function(){
//     count++;
// })

// stream.on('close',function(){
//     console.log("Indexed " + count + "document")
// })

// stream.on('error',function(err){
//     console.log(err);
// })


// stream.on("data",function(err,doc){
//     client.indices.create({
//         index:'courses',
//         body:{
//             doc
//         }
//     },function(error,response){
//         console.log(response)
//     })
// })


const s3 = new aws.S3({
    apiVersion:'2006-03-01',
    accessKeyId:process.env.AWS_ID,
    secretAccessKey:process.env.AWS_SECRET
})

const upload = multer({
    storage:multerS3({
        s3:s3,
        bucket:'lmsbucket123',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // metadata:(req,file,cb)=>{
        //     cb(null,{fieldName: file.fieldName})
        // },
        key:(req,file,cb)=>{
            const ext = path.extname(file.originalname);
            cb(null,`${uuid()}${ext}`)
        }

    })

})

//functions 
const {createCourse,getAllCourse,getCourseById,getCourse,deleteCourse,updateCourse,getMaterial,deleteMaterial,deleteImage,deletesubFromCourse} = require('../controllers/course')
const {isAdmin,isAuthenticated,isSignedIn} = require('../controllers/auth')
const {getUserById} = require('../controllers/user');
const { Stream } = require('stream');
//params
router.param('userId',getUserById)
router.param('courseId',getCourseById)
//actual routes go here
// router.post('/course/create/:userId',isSignedIn,isAuthenticated,isAdmin,multer({dest:'/temp'}).fields([{
//     name:'cimg',
//     name:'material'
// }]),createCourse,function(req,res){
//     console.log("################################")
// });

//create new course (By Admin)



router.get('/search/name',function(req,res,next){
    if(req.query.q){
        Course.search({
          query_string:{
            fields:['cname'],
            query:req.query.q,
            type:'phrase_prefix',
        }  
        },function(err,results){
            if(err){
                return err;
            }
            console.log('reached here DARADFSADFSADF')
            const data = results.hits.hits.map(function(hit){
                // console.log("hit==",hit._source)
                return hit._source;
            })
            return res.send(data);
        })
    }
})

router.get('/search/tags',function(req,res,next){
    console.log(req.query.q)
    var arr=[];
    arr = req.query.q.split(',')
    console.log(arr)
    if(arr){
        Course.search({
          "query":{
            // fields:['tags'],
    //         "terms_set": {
    //         "tags": {
    //         "terms": arr,
    //         "minimum_should_match_script": {
    //          "source": "1"
    //          },
    //     }
    // }
    "filtered": {
           "query": {
               "match_all": {}
           },
           "filter": {
               "bool": {
                   "must": [
                      {
                          "terms": {
                             "tags": arr,
                             "minimum_should_match": 1
                          }
                      }
                   ]
               }
           }
       }
            // query:req.query.q,
            // type:'phrase_prefix',
        }  
        },function(err,results){
            if(err){
                console.log(err)
                return res.json({
                    err:'err from elasticsearch'
                });
            }
            console.log('reached here DARADFSADFSADF')
            const data = results.hits.hits.map(function(hit){
                // console.log("hit==",hit._source)
                return hit._source;
            })
            return res.send(data);
        })
    }
})


router.post('/course/create/:userId',isSignedIn,isAuthenticated,isAdmin,createCourse);




//get all courses saved in database (By everyone)
router.get('/course/:courseId/',getCourse)

//get all materials (bY Signed users)
router.get('/course/material/:courseId',isSignedIn,isAuthenticated,getMaterial)

// delete a material (by ADMIN)
router.delete('/course/material/:courseId/:userId/',isSignedIn,isAuthenticated,isAdmin,deleteMaterial)

//delete a course image (by ADMIN)
router.delete('/course/image/:courseId/:userId',isSignedIn,isAuthenticated,isAdmin,deleteImage)

//delte a sub from course
router.delete('/course/sub/:courseId/:userId',isSignedIn,isAuthenticated,isAdmin,deletesubFromCourse)

//delete a course (By ADMIN)
router.delete('/course/:courseId/:userId',isSignedIn,isAuthenticated,isAdmin,deleteCourse)

//update course details (By ADMIN)
router.put('/course/:courseId/:userId',isSignedIn,isAuthenticated,isAdmin,updateCourse)


// listing route

router.get('/courses/',getAllCourse)



//update course details (By ADMIN)
// router.put('/course/:couresId/:userId',isSignedIn,isAuthenticated,isAdmin,getCourseById,updateCourse)

//delete a course (By ADMIN)
// router.delete('/course/:courseId/:userId',isSignedIn,isAuthenticated,isAdmin,deleteCourse)

//update course details (By ADMIN)
// router.put('/curse/:couresId/:userId',isSignedIn,isAuthenticated,isAdmin,getCourseById,updateCourse)
module.exports = router;