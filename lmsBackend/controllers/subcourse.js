const SubCourse = require('../models/subcourse')
const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')
const uuid = require('uuid').v4;
const _ = require('lodash')
const course = require('../models/course');
// const client = require('elasticsearch');


const s3 = new aws.S3({
    apiVersion:"2006-03-01",
    accessKeyId:process.env.AWS_ID,
    secretAccessKey:process.env.AWS_SECRET
})

const upload = multer(
    {
    storage:multerS3({
        s3:s3,
        bucket:'lmsbucket123',
        acl: 'public-read',
        contentType:multerS3.AUTO_CONTENT_TYPE,
        metadata:(req,file,cb)=>{
            cb(null,{filename:file.originalname});

        },
        key:(req,file,cb)=>{
            console.log(file.originalname)
            console.log('eere;;',req.course.cname)
            cb(null,`videos/${req.course.cname}/${req.body.name}/${uuid()}Biblioklept${file.originalname}`)
        }
    })

})



//create subcourse (BY ADMIN)
exports.createSubCourse = (req,res)=>{
    upload.fields([
        {
            name:"videos"
        }
    ])(req,res,(err)=>{
        if(err){
            console.log(err)
        }
        // const par={
        //     Bucket:'lmsbucket789',
        //     Key:'x-amz-meta-filename'
        // }
        // const metaData = s3.headObject(par).promise();
        // console.log(metaData);
        arrayFiles = req.files 
        doc = []
        if(arrayFiles.videos){

            for(let i=0;i<arrayFiles.videos.length;i++){
                doc.push(arrayFiles.videos[i].location)
            }
        }
        console.log(doc)
        const newSubCourse = new SubCourse({...req.body,videos:doc})
        newSubCourse.save((err,data)=>{
            if(err){
                console.log(err)
                return res.status(403).json({
                    err:"uable to create new subCourse"
                })
            }
            return res.status(200).json({
                msg:"sucessfully created the subcourse",
                data})
        }) 
    })
}

//get subcourse by id
exports.getSubCourseById = (req,res,next,id)=>{
    console.log('id::',id)
    SubCourse.findById(id).exec((err,data)=>{
        if(err){
            return res.status(400).json({
                err:"Sub Course not found"
            })
        }
        req.subCourse = data
        console.log("SADF::",data)
        next();
    })
}


//delete any subcourse
exports.deleteSubCourse = (req,res)=>{
    console.log('req.subCOURSEL::',req.subCourse)
    let subCourse = req.subCourse
    subCourse.remove((err,data)=>{
        if(err){
            return res.status(400).json({
                err:"could not delte subCourse"
            })
        }
        res.json({
            msg:"subCourse deleted successfully",
            data
        })
    })
}

//update SUBCOURSE
exports.updateSubCourse = (req,res)=>{
    let subCourse = req.subCourse
    upload.fields([
        {
            name:"videos"
        }
    ])(req,res,(err)=>{
        if(err){
            console.log(err)
        }
        arrayFiles = req.files 
        doc = []
        if(arrayFiles.videos){
            for(let i=0;i<arrayFiles.videos.length;i++){
                req.subCourse.videos.push(arrayFiles.videos[i].location)
            }
        }
       subCourse = _.extend(subCourse,req.body);
       subCourse.save((err,data)=>{
           if(err){
               console.log(err)
               return res.status(403).json({
                   err:"could not update subcourse"
               })
           }
           return res.status(200).json({
               msg:"subcourse updated sucessfully",
               data
           })
       })
    })
}

//get subcourseBY ID
exports.getSubCourse=(req,res)=>{
    console.log('getSubCourse',req.subCourse)
    let subCourse = req.subCourse
    return res.json(subCourse)
}

//delete any Video from subCourse
exports.deleteSubVideo= async(req,res)=>{
    cid = req.params.courseId 
    sid = req.params.subCourseId
    url = req.body.url
    
    try {

        const result = await SubCourse.findById({_id:sid})
        console.log('result video:',result)
        result.videos.pull(url)
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