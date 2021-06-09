import React,{useState,useEffect} from 'react'
import Base from '../core/Base'
import './courseedit.css'
import {Link} from 'react-router-dom'
import {createSubCourse,updatedCourseById} from '../admin/helper/adminapicalls'
import {isAuthenticated} from '../auth/helper/index'

const AddSubCourse=(props)=> {
    //props recieved from links
    const cname = props.match.params.courseName;
    const item = props.location.state;
    const material = null;
    const img = null;
    const updateCourse = null;
    const tag = null;
    const {user,token} = isAuthenticated();
    // const ItemID = item._id
    //states
    const [error,setError] = useState(false)
    const [success,setSuccess] = useState(false)
    const [loading,setLoading] = useState(false)
    const [time,setTime] = useState(null)
    const [result,setResult]= useState(null);
    const [video,setVideo] = useState(null);
    // const [course,setCourse] = useState(item._id);
    const [btn,setbtn] = useState(false);
    const [subCourse,setSubCourse]= useState({
        name:'',
        description:'',
        course:item._id
    })

    const {name,description,course} = subCourse;
    // useEffect(() => {
    //     console.log('ASDF')
    //     setResult('hun')
    //     console.log(result);
    //      setSubCourse((subCourse)=>({name:"",description:""}))
    //     console.log(subCourse)
    // }, [success]);
    //handel change Function
    const handelChange = data => event =>{
        setLoading(false)
        setError(false)
        setSuccess(false)
        setSubCourse({...subCourse,[data]:event.target.value});
    }

    const submitBtn = (event)=>{
        event.preventDefault();
        setLoading('Loading Please Wait...')
        setError(false)
        setSuccess(false)
        setbtn(true);
        // console.log(video);
        createSubCourse(course,user._id,token,subCourse,video)
        .then(data=>{
            if(data.err){
                setLoading(false)
                setError('Error Creating Sub Course...')
                console.log(data.err)
            }
            else{
                setLoading(false)
                setError(false)
                setSuccess('Successfully Created Sub Course...')
                console.log(data)
                updatedCourseById(course,user._id,token,material,img,updateCourse,tag,data.data)
                .then(data=>{
                    if(data.err){
                        console.log(data.err)
                    }
                    else{
                        console.log(data)
                    }
                })
                .catch()
                setSubCourse({name:'',description:'',course:item._id})
                setTime(Date.now());
                setVideo(null)
                setbtn(false);
            }
        })
        .catch(err=>{
            console.log(err)
        })

    }

    const handelVideo = (event)=>{
        const files = Array.from(event.target.files)
        setVideo(files);
    }
    
    

    const subCourseForm = ()=>{
        // console.log('render')
        // console.log('ss:',subCourse)
        // console.log(name,description)
        return(
            <div className='bg-transparent center'>
                <form className='bg-transparent form-edit'>
                    <label className='p-2 m-2 bg-transparent'> SubCourse title *</label>
                    <input
                    type='text'
                    maxLength='100'
                    placeholder='Sub Course Title'
                    className='p-2 m-2'
                    disabled={btn}
                    value={name}
                    onChange={handelChange("name")}
                    />
                    <label className='p-2 m-2 bg-transparent'> Description </label>
                    <textarea
                    type='text'
                    maxLength='400'
                    placeholder='Description max(400)'
                    className='p-2 m-2'
                    disabled={btn}
                    value={description}
                    onChange={handelChange("description")}
                    />
                    <label className='p-2 m-2 bg-transparent'> Videos </label>
                    <input
                    label='course price'
                    type='file' 
                    placeholder=' ex: 399'
                    className='p-2 m-2'
                    accept='video/mp4,video/x-m4v,video/*'
                    disabled={btn}
                    key={time|| null}
                    onChange={(e)=>{handelVideo(e)}}
                    multiple
                    />
                    <div className='w-100 d-flex justify-content-center bg-transparent'>
                        <button className='save-btn m-2 mt-5 p-2 border-transparent rounded' disabled={btn} onClick={submitBtn}>SUBMIT</button>
                        <Link to='/admin/dashboard' className='homeLink m-2 mt-5 p-2 text-center text-white rounded text-decoration-none'>ADMIN HOME</Link>
                    </div>
                </form>
            </div>
        )
    }

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


    return (
        <Base title='Create SubCourse for,' description={cname} >
        {loadingMessage()}
        {errorMessage()}
        {successMessage()} 
        <h4 className='p-2 h4 text-center'>CREATE SUBCOURSE</h4>
            {subCourseForm()}
         </Base>
    )
}

export default AddSubCourse;