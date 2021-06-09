import React,{useState ,useEffect} from 'react'
import './dropdown.css'
import {MdDelete,MdEdit} from 'react-icons/md'
import {RiArrowDropDownLine,RiDeleteBin7Fill} from "react-icons/ri";
import {IconContext} from 'react-icons/lib'
import {isAuthenticated} from '../auth/helper'
import {updateSubCourse,updatedCourseById,deleteVideo,deleteSubCourse,deleteSubFromCourse} from './helper/adminapicalls'
import SubCourse, {subCourse} from '../admin/SubCourse'
const DropDown=(subCourse) =>{
    // console.log(name,btn)
    const subData = {name:subCourse.name,videos:subCourse.videos,description:subCourse.description,course:subCourse.course,_id:subCourse._id}
    // console.log('YAY:',subCourse)
    const material = null;
    const tags = null;
    const image = null;
    const updateCourse = null;
    let i =0;
    const {user,token} = isAuthenticated();
    const [click,setClick] = useState(false);
    const [alreadyVideo,setAlreadyVideo] = useState(subCourse.videos)
    const [videoMaterial,setVideoMaterial] = useState(null)
    const [obj,setObj]=useState(subData);
    const [btn,setBtn] = useState(true);
    const [time,setTime] = useState(null);
    const [uploadBtn,setUploadBtn] = useState(false);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false);
    const [success,setSuccess] = useState(false);
    const [fun,setfun] = useState(false);
    const [del,setDel] = useState(false);

    console.log('obj:',obj)
    // const {name,description,_id,course} = obj; 
    useEffect(() => {
        console.log('hii::',subCourse.videos)
        setAlreadyVideo(subCourse.videos)
    }, []);

     const close=(event)=>{
        event.preventDefault();
        setError(false)
        setSuccess(false)
        setClick(!click)
    }

    const handelChange = data => event => {
        // console.log(data,obj)
        setSuccess(false)
        setError(false)
        setLoading(false)
        setObj({...obj,[data]:event.target.value})
    }

    const handelChangeVideo = (e)=>{
        setLoading(false)
        setError(false)
        setSuccess(false)
        const doc = Array.from(e.target.files)
        setVideoMaterial(doc)
    }

    const saveBtn = (event)=>{
        event.preventDefault();
        setBtn(true);
        setLoading('Loading Please Wait...')
        setError(false)
        setfun(true);
        setSuccess(false)
        console.log('TEST::',obj)
        console.log('OOLL::',videoMaterial)
        updateSubCourse(obj.course,obj._id,user._id,token,videoMaterial,obj).
        then(data=>{
            if(data.err){
                setError('Error Updating Course...')
                console.log(data.err)
            }
            else{
                // console.log('updated SUBCOURSE',data);
                // setObj(data.data)
                setLoading(false);
                setSuccess('Successfully updated Sub Course...')
                updatedCourseById(obj.course,user._id,token,material,image,updateCourse,tags,data.data)
                .then(data=>{
                    if(data.err){
                        console.log(data.err)
                    }
                    else{
                        console.log('updatedCourse:',data)
                    }
                })
            }
        })
        setfun(false)
        
    }

    const editButton = (event)=>{
        event.preventDefault();
        setSuccess(false)
        setError(false)
        setBtn(false);
    }

    const uploadButton = (event)=>{
        setUploadBtn(true);
        setBtn(true);
        setError(false)
        setfun(true)
        setSuccess(false)
        setLoading('Loading... Saving Videos in DB Please Wait...')
        event.preventDefault();
        setTime(Date.now());
        console.log('videoTT::',videoMaterial)
        updateSubCourse(obj.course,obj._id,user._id,token,videoMaterial)
        .then(data=>{
            if(data.err){
                setLoading(false)
                setError('Error Uploading Videos...')
                console.log(data.err)
            }
            else{
                setLoading(false)
                setSuccess('Successfully uploaded Videos...')
                console.log("REF::",data)
                setObj(data.data)
                setAlreadyVideo(data.data.videos)
                setVideoMaterial(null);
                console.log('videoUpload:',data.data.videos)
                updatedCourseById(obj.course,user._id,token,material,image,updateCourse,tags,data.data)
                .then(data=>{
                    if(data.err){
                        console.log(data.err)
                    }
                    else{
                        console.log(data)
                        
                    }
                })
                setUploadBtn(false);
                setfun(false);
            }
        })
    }

    const deleteBtn = (event,url)=>{
        event.preventDefault();
        setBtn(true)
        setError(false)
        setSuccess(false)
        setfun(true)
        setLoading('DElETEING video form subCourse please wait...')
        deleteVideo(obj.course,obj._id,user._id,token,{url})
        .then(data=>{
            if(data.err){
                setLoading(false)
                setError('Error deleting Videos...')
                console.log(data.err)
            }
            else{
                setLoading(false)
                setSuccess('Successfully deleted the video...')
                console.log('data::',data);
                console.log('imp::',data.videos)
                // const test = data;
                // const test = 
                let dd = {}
                dd = data
                setObj(dd);
                setAlreadyVideo(data.videos)
                updatedCourseById(obj.course,user._id,token,material,image,updateCourse,tags,data)
                .then(data=>{
                    if(data.err){
                        console.log(data.err)
                    }
                    else{
                        console.log(data)
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
            }
            setfun(false)
        })
        .catch()
    }

    //messages
     const loadingMessage = ()=>{
          if(loading){
             return(
                <div>
                <h5 className='alert font-weight-bold alert-success text-center'>{loading}</h5>
                </div>
                
            )
        }
    }

    const successMessage = ()=>{
        if(success){
            return(
                <div>
                <h5 className='alert font-weight-bold alert-success text-center'>{success}</h5>
                </div>   
            )
        }
    }

    const errorMessage = ()=>{
           if(error){
            return(
                <div>
                <h5 className='alert alert-danger font-weight-bold text-center'>{error}</h5>
                </div>   
            )
        }
    }

    const delsubBtn = (event)=>{
        event.preventDefault()
        setDel(true);
    }
    
    const deleteSubCouresebtn = (event)=>{
        event.preventDefault();
        setDel(false)
        setLoading('Deleting SubCourse please wait...')
        setError(false)
        setSuccess(false)
        console.log('OBJID::',obj._id)
        deleteSubCourse(obj.course,obj._id,user._id,token)
        .then(data=>{
            if(data.err){
                setLoading(false)
                setError('Error deleting SubCourse...')
                console.log(data.err)
            }
            else{
                console.log(data)
                setLoading(false)
                setSuccess('Successfully deleted SubCourse...')
                deleteSubFromCourse(obj.course,obj._id,user._id,token,data)
                .then(data=>{
                    if(data.err){
                        console.log(data.err)
                        setLoading(false)
                        setError('Error deleting video from Course...')
                    }
                    else{
                        console.log(data.sub);
                        setLoading(false)
                        setSuccess('Successfully deleted SubCourse...')
                        window.location.reload(false);
                    }
                })
                
            }
        })
    }

    const cancelBtn = (event)=>{
        event.preventDefault();
        setDel(false)
    }

    const deleteSUB = ()=>{
        if(del){
            return (
                <div className='modal-overlay show-modal'>
                    <div className='bg-light text-dark d-flex flex-column p-2'>
                    Are you sure you want to delete this sub Course?
                    <h6 className='bg-transparent font-weight-bold text-danger mt-2'>"{obj.name}"</h6>
                    <div className='d-flex mt-4 justify-content-between bg-transparent'>
                    <button className='button-a m-2 p-1 rounded' onClick={cancelBtn}>Cancel</button>
                    <button className='del-button m-2 p-1 rounded' onClick={deleteSubCouresebtn}>Delete</button>
                    </div>
                    </div>
                </div>
            )
        }
    }

    console.log('render')
    return (
        <div className='bg-transparent w-100'>
        <div className='m-4 mt-2 mb-2 bg-transparent drop-h'>
        {successMessage()}
        {errorMessage()}
        {loadingMessage()}
        {deleteSUB()}
        {subCourse.name}
        <button className='button-a p-1 rounded m-2' onClick={close}><RiArrowDropDownLine className='bg-transparent rounded m-0' size={25}/></button>
        <button className='del-button p-1 rounded m-2' onClick={delsubBtn}><RiDeleteBin7Fill className='bg-transparent rounded m-0' size={21}/></button>
        </div>
            <div className={click ? 'drop-not bg-transparent': 'drop-clicked bg-transparent'}>
                <form className='form-drop m-2 bg-transparent'>
                <div className='d-flex justify-content-between align-items-center'>
                    <input
                    type='text'
                    className='p-2 m-2 mt-1 w-100'
                    placeholder='sub Course name'
                    disabled={btn}
                    value={obj.name}
                    onChange={handelChange("name")}
                    /> 
                    <button className='button-a p-2  rounded' disabled={fun} onClick={editButton}>Edit</button>
                    <button className='p-2 m-2 rounded drop-savebtn' disabled={fun} onClick={saveBtn}>save</button>
                </div>
                    <div className='d-flex justify-content-between align-items-center'>
                    <textarea
                    type='text'
                    className='p-2 m-2 mt-0 w-100'
                    placeholder='description'
                    disabled={btn}
                    value={obj.description}
                    onChange={handelChange("description")}
                    />
                        <button className='button-a p-2 rounded' disabled={fun} onClick={editButton} >Edit</button>
                        <button className='p-2 m-2 rounded drop-savebtn' disabled={fun} onClick={saveBtn}>save</button>
                </div>
                <div>
                {alreadyVideo.map(file=>{
                    var s = file;
                    s = s.split('Biblioklept');
                    return (
                        <div className='p-2 m-2 mt-2 bg-transparent d-flex justify-content-between'>
                            <a href={file}
                            className='p-2'
                            >
                            {s[1]}</a>
                            <div>
                                <a className='p-2 m-2 text-decoration-none button-a rounded text-white' disabled={fun} href={file}>View</a>
                                <button className='p-1 rounded del-button' disabled={fun} onClick={(e)=>deleteBtn(e,file)}>Delete</button>
                            </div>
                            </div>
                        )                
    
                 })}  
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                    <input
                    type='file'
                    placeholder='selectvideo'
                    className='p-2 m-2'
                    accept='video/mp4,video/x-m4v,video/*'
                    key={time || null}
                    disabled={uploadBtn}
                    onChange={(e)=>handelChangeVideo(e)}
                    multiple
                    />
                    <div>
                    <button className='button-a p-2 pt-1 pb-1 rounded' disabled={uploadBtn} onClick={uploadButton}>upload</button>
                    <button className='p-1 m-2 rounded del-button' disabled={uploadBtn}>remove</button>
                    </div>
                </div>
                </form>
            </div>
        </div>
    )
}
export default DropDown;
