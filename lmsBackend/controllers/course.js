const Course = require('../models/course')
const aws = require("aws-sdk")
const multer = require("multer")
const multerS3 = require("multer-s3")
const uuid = require("uuid").v4;
const fs = require('fs')
const path = require('path');
const _ = require('lodash');
const course = require('../models/course');
const { response } = require('express');
const {Client} = require('@elastic/elasticsearch')
const createAwsElasticsearchConnector = require('aws-elasticsearch-connector')

const s3 = new aws.S3({
    apiVersion:'2006-03-01',
    accessKeyId:process.env.AWS_ID,
    secretAccessKey:process.env.AWS_SECRET
})

const awsConfig = new aws.Config({
    apiVersion:'2006-03-01',
    accessKeyId:process.env.AWS_ID,
    secretAccessKey:process.env.AWS_SECRET,
    region:'us-east-1'
})

const upload = multer({
    storage:multerS3({
        s3:s3,
        bucket:'lmsbucket123',
        acl: 'public-read',
        ContentDisposition:'inline',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // metadata:(req,file,cb)=>{
        //     cb(null,{fieldName: file.fieldName})
        // },
        key:(req,file,cb)=>{
            const ext = path.extname(file.originalname);
            let dir = ''
            // console.log('22222222222222',req.body.cname)
            if(file.fieldname=='cimg'){
                 dir='courseImages'
            }
            else if(file.fieldname=='material'){
                 dir ='courseMaterial'
            }
            cb(null,`${dir}/${req.body.cname}/${uuid()}Biblioklept${file.originalname}`)
        }
    })

})


const saveCourse=(req,res)=>{
    const course = new Course(req.body);
    course.save((err,data)=>{
        if(err){
            console.log(err);
            return res.json({
                err:"unable to save course in the db"
            })
        }
        return res.json(data)
    })
}

//course create (By Admin)
exports.createCourse=(req,res)=>{
    console.log(req.file)
    upload.fields([{
        name:'cimg',
        maxCount:1
    },{
        name:'material',
    }])(req,res,(errors)=>{
        if(errors){
            return console.log(errors)
        }
        console.log('REQ.FILES',req.files);
        console.log(req.body)
        const arrayFiles = req.files
        let img = ''
        let doc = []
        if(arrayFiles){

            if(arrayFiles.cimg){
                img = arrayFiles.cimg[0].location
            }
            if(arrayFiles.material){
            for(let i=0;i<arrayFiles.material.length;i++){
                doc.push(arrayFiles.material[i].location)
            }
        }
        }
        console.log(doc)
        console.log('REQ:::',req.body);
        const course = new Course({...req.body,cimg:img,material:doc});
        course.save((err,data)=>{
        if(err){
            console.log(err);
            return res.json({
                err:"unable to save course in the db"
            })
        }
        console.log('CHECK::',data)
        indexCourseDocument(data)
        return res.json(data)
    })
    })
    
    // return console.log(req.files.location)
}


//get all courses (everyone)
exports.getAllCourse=(req,res)=>{
    Course.find().exec((err,courses)=>{
        if(err){
            console.log(err)
            return res.status(403).json({
                err:"no courses found"
            })
        }
        return res.json(courses)
    })
}

//get a course by id (everyone)
exports.getCourseById=(req,res,next,id)=>{
    Course.findById(id).exec((err,data)=>{
        if(err){
            console.log(err)
            return res.status(403).json({
                err:"course not found in db or course invalid"
            })
        }
        // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',data)
        req.course=data
        // console.log("REQ.COURSE=",req.course);
        next()
    })
}

//get a single course
exports.getCourse=(req,res)=>{
    res.json(req.course)
}

//delete a course 
exports.deleteCourse=(req,res)=>{
    console.log('#########################',req.course)
    const id = req.params.courseId
    // Course.findOne({'_id':id},function(err,instance){
    //     if(err){
    //         console.log('ERR:',err)
    //     }
    //     else{
    //         console.log(instance)
    //         instance.remove(function(err){
    //             if(err) console.log(err);
    //             instance.on('es-removed',function(err,res){
    //                 if(err) throw err;
    //             })
    //         })
    //     }
    // })

    Course.findByIdAndRemove(id,function(err,data){
        if(err){
            console.log(err)
            return res.json({
                err:"item not found in db"
            })
        }
        return res.json({
            msg:"element sucesfully deleted",
            data})

    })
    // course.remove((err,course)=>{
    //     if(err){
    //         return res.status(400).json({
    //             err:"failed to delete course"
    //         })
    //     }
    //     res.json({
    //         msg:"successfull deleted course",
    //         course
    //     })
    // })
}



//update a course
exports.updateCourse=(req,res)=>{
    let course = req.course;
    // console.log(req.course.material)
    // console.log('COURSE IS=',course)
    upload.fields([
        {
            name:"cimg",
            maxCount:1
        },
        {
            name:"material"
        }])(req,res,(errors)=>{
            if(errors){
                console.log(errors)
            }
            console.log('req.Files',req.files)
            const aFiles = req.files
            if(aFiles.cimg){
                course.cimg=aFiles.cimg[0].location
            }
            if(aFiles.material){
                for (let i=0;i<aFiles.material.length;i++){
                    course.material.push(aFiles.material[i].location)
                }
            }

            const {cname,description,price,category,students_count} = req.body
            if(req.body.sub){
                var obj = {}
                obj = req.body.sub;
                let helo = course.sub.findIndex(item => item._id == obj._id)
                console.log(helo)
                if(helo<0){
                    course.sub.push(obj)
                }
                else{
                    course.sub[helo] = obj;
                }
                console.log('TEST:',course.sub);
                // console.log('SUB::',course.sub[1])
                // course.sub[1] = obj;
                // console.log('SUB::',course.sub[1])
                // console.log('OOO::',helo)
            }
            else{
            course = _.extend(course,req.body)
            }
            course.save((err,data)=>{
                if(err){
                    console.log(err)
                    return res.status(403).json({
                        err:"cannot update course"
                    })
                }
                console.log('here:',data)
               return res.json({
                msg:"course updated sucessfully",   
                data})
            })

        })
    // console.log(req.params.courseId)
    // console.log(req.course)
    // console.log('$$$$$$$$$$$$$$$$',req.course)
    // return res.json('hello')
}


//get material only (BY SIGNED USERs)
exports.getMaterial=(req,res)=>{
    if(req.course.material){
        return res.send(req.course.material)
    }
}

exports.updateNoOfStudentsEnrolled =(req,res,next)=>{
    console.log("updateNoOfStudents",req.body);    
}


//delete a material 
var ObjectId = require('mongoose').Types.ObjectId;
const { findById } = require('../models/course');
exports.deleteMaterial= async(req,res)=>{
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, Content-Type, Accept",
//     );
    console.log('PRAS:',req.params.courseId);
    console.log('url',req.body.url)
    const url = req.body.url
    const _id = req.params.courseId

    try { 
        const result = await Course.findById({_id})
        console.log('result::',result);
        result.material.pull(url);
        await result.save();
        console.log('RES2:',result)
        return res.status(200).json(result);
    } catch (error) {
        console.log('Error:',error)
        return res.status(400).json({
            err:"err while updation"
        })
    }
}

//delete course image 
exports.deleteImage = async (req,res) =>{
    // const url = req.body.url
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
    const _id = req.params.courseId
    try {
        const result = await Course.findById({_id})
        console.log(result);
        result.cimg = "";
        result.save();
        return res.status(200).json(result)
    } catch (error) {
        console.log('Err img deltetion:',error)
        return res.status(400).json({
            err:"err while deletion of image"
        })
    }

}

exports.deletesubFromCourse =async (req,res)=>{
    console.log('PRAS:',req.params.courseId);
    const sid = req.params.subCourseId
    const _id = req.params.courseId
    console.log("YAY:::",req.body)
    try { 
        const result = await Course.findById({_id})
        console.log('result::',result);
        result.sub.pull(req.body.data);
        await result.save();
        console.log('RES2:',result)
        return res.status(200).json(result);
    } catch (error) {
        console.log('Error:',error)
        return res.status(400).json({
            err:"err while updation"
        })
    }
}


const indexCourseDocument = async (doc)=>{
    // var endpoint = new aws.Endpoint("https://search-lms-search-service-7b5djyyusztub3tftjknqxqyqm.us-east-1.es.amazonaws.com")
    // var request = new aws.HttpRequest(endpoint,'us-east-1')

    // request.method='POST'
    // request.path+= 'course' + '/' + '_doc'
    // request.body = JSON.stringify(doc);
    // request.headers['host'] = "https://search-lms-search-service-7b5djyyusztub3tftjknqxqyqm.us-east-1.es.amazonaws.com"
    // request.headers['content-type'] = 'application/json'
    // request.headers['Content-Length'] = Buffer.byteLength(request.body,'utf8');

    // var credentials = new aws.EnvironmentCredentials('aws');
    // var signer = new aws.Signer({
    //     apiVersion: '2017-08-25',
    //     request:'es',
    //     accessKeyId:process.env.AWS_ID,
    //     secretAccessKey:process.env.AWS_SECRET
    // })
    // signer.addAuthorization(credentials,new Date())
    
    const client = new Client({
        ...createAwsElasticsearchConnector(awsConfig),
        node:"https://search-lms-search-service-7b5djyyusztub3tftjknqxqyqm.us-east-1.es.amazonaws.com"
    }
    
    )
    console.log("IMP::",JSON.stringify(doc))
    const docmnt= {...doc,id:doc._id}
    client.index({
        index:'course',
        body:JSON.stringify(docmnt)
    }).then(response=>{
        console.log('KKKK::',response)
    }).catch(err=>{
        console.log("ERRR::",err)
    })
    // var test = await new aws.HttpClient();
    // test.handelRequest(request,null,function(response){
    //     console.log(response.statusCode + ' ' + response.statusMessage);
    //     var responseBody = '';
    //     response.on('data', function (chunk) {
    //         responseBody += chunk;
    //     });
    //     response.on('end', function (chunk) {
    //         console.log('Response body: ' + responseBody);
    //     });
    //     }, function(error) {
    //         console.log('Error: ' + error);
    // })
}






















// const upload = multer({
//     storage:multerS3({
//         s3:s3,
//         bucket:'lmsbucket789',
//         contentType: multerS3.AUTO_CONTENT_TYPE,
//         metadata:(req,file,cb)=>{
//             cb(null,{fieldName: file.fieldName})
//         },
//         key:(req,file,cb)=>{
//             const ext = path.extname(file.originalname);
//             cb(null,`${uuid()}${ext}`)
//         }

//     })

// })


//create Product (By ADMIN)
// exports.createCourse=(req,res)=>{
//     console.log(process.env.AWS_REGION)
//     aws.config.setPromisesDependency();
//     aws.config.update({
//         accessKeyId:process.env.AWS_ID,
//         secretAccessKey:process.env.AWS_SECRET,
//         region:process.env.AWS_REGION
//     });
//     const s3 = new aws.S3();
//     if(req.file){

//         const ext = req.file.originalname 
//         const fname = `${uuid()}${ext}`
//         if(req.file.fieldname=='cimg'){
//             console.log("CIMG @@@@@@@@@@@@@@@@@@@@@@@@")
//         }
//     var params ={
//         ACL:'public-read',
//         Bucket:process.env.AWS_BUCKET_NAME,
//         Body:fs.createReadStream(req.file.path),
//         Key:`courseimages/${fname}`,
//         // `userAvatar/${req.file.originalname}`
//     };
// }
//     s3.upload(params,(err,data)=>{
//         if(err){
//             console.log(err)
//             console.log("err occured in storing in db")
//         }
//         if(data){
//             console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
//             console.log(data)
//             console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
//             fs.unlinkSync(req.file.path);
//             const locationUrl = data.Location;
//             let newCourse = new Course({...req.body,cimg:locationUrl,material:locationUrl});
//             newCourse.save((err,course)=>{
//                 if(err){
//                     console.log(err)
//                     return res.status(403).json({
//                         err:"unable to store course in db"
//                     })
//                 }
//                 return res.json(course)
//             })
//         }
//     })
    
// }

// const uploadCourse = multer({
//     s3:s3,
//     acl:'public-read',
//     bucket:process.env.AWS_BUCKET_NAME,
//     metadata:(req,file,cb)=>{
//         cb(null,{fieldname:file.fieldname})
//     },
//     key:(req,file,cb)=>{
//         var fullPath = `course/${file.fieldname}/${uuid()}${file.originalname}`
//         cb(null,fullPath)
//     }
// })

// exports.createCourse=(req,res)=>{
//     uploadCourse(req,res,(err)=>{
//         console.log('files',req.files)
//         if(err){
//             console.log(err);
//             return res.status(500).json({
//                 err:'unable to upload files in db'
//             })
//         }

//     })
// }