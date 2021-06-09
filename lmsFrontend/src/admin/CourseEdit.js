import React,{useState,useEffect} from 'react'
import Base from '../core/Base'
import {Link, useHistory} from 'react-router-dom'
import './courseedit.css'
import {allcategories,getCategoryByID,deleteMaterial,courseById,updatedCourseById,deleteImage} from './helper/adminapicalls'
import {Document,Page,pdfjs} from 'react-pdf'
import {FaFilePdf} from 'react-icons/fa'
import TagsInput from 'react-tagsinput'
import {isAuthenticated} from '../auth/helper/index'
import UpdateCourse from './UpdateCourse'


const CourseEdit=(props) => {
    const name= props.match.params.courseName;
    const test = props.location.myCustomProps;
    const data = props.location.state;
    // console.log(props.history);
    // console.log('DATA:',data)
    const {user,token} = isAuthenticated();
    
    const [updateCourse,setupdateCourse] = useState({
        cname:'',
        description:'',
        price:'',
        category:'',
        material:[],
        cimg:'',
        tags:[]
    })

    const [categories,setCategories] = useState([])
    const [selected,setSelected] = useState('')
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [timemat,setTimeMat] = useState(null);
    const [time,setTime] = useState(null);
    const [tags,setTags] = useState([]);
    const [updateMaterial,setUpdateMaterial] = useState(null);
    const [image,setImage] = useState(null);
    const [loading,setLoading] = useState(false);
    const [success,setSuccess] = useState(false);
    const [error,setError] = useState(false);
    const [btn,setBtn] = useState(false)
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    // console.log('dataCourse::',updateCourse)
    // console.log('category:',selected)
    // console.log('material:',updateCourse.material[0])
    
    const {_id,cname,cimg,material,category,price,description} = updateCourse;

    useEffect(() => {
     findCourse();
     categoriesFunction();
    }, []);

    const categoriesFunction = ()=>{
        allcategories()
        .then(data=>{
            if(data.err){
                console.log(data.err)
            }
            else{
                setCategories(data);
            }
        })   
    //     // console.log('category(((:',category)
    //  getCategoryByID(updateCourse.category)
    //  .then(data=>{
    //      if(data.err){
    //          console.log(data.err)
    //      }
    //      else{
    //         //  console.log('DAGA:',data)
    //          setSelected(data.name)
    //      }
    //  })
    }

    const findCourse = () =>{
        // console.log('hello')
        setLoading('LOADING...');
        setError(false);
        setSuccess(false);
        courseById(data._id)
        .then(data=>{
            if(data.err){
                console.log(data.err)
            }
            else{
                setLoading(false);
                setupdateCourse(data)
                console.log(data.tags)
                setTags(data.tags)
                getCategoryByID(data.category)
                .then(data=>{
                    if(data.err){
                        console.log(data.err)
                    }
                    else{
                        console.log(data);
                        console.log(data.name)
                        setSelected(data.name)
                    }
                })
            }
        })
    } 

    const handelChange = value => event =>{
        setError(false);
        setLoading(false);
        setSuccess(false);
        console.log('VALUE',value);
        if(value==='category'){
            categories.map(cat=>{
                if(cat.name == event.target.value){
                    setupdateCourse({...updateCourse,[value]:cat._id});
                    setSelected(event.target.value)
                }
            })
        }
        else{

            setupdateCourse({...updateCourse,[value]:event.target.value});
        }
        console.log('updated',updateCourse)
    } 

    const handelChangeMaterial = (e)=>{
        const doc = Array.from(e.target.files)
        setUpdateMaterial(doc);
    }

    const handelChangeImage = (e) =>{
        const img = e.target.files[0];
        console.log(img);
        setImage(img);
    }

    const handelTags = (tag) =>{
        setTags(tag);
    }

    //delete/upload buttons
    const deleteMaterialBtn = (event,url) =>{
        event.preventDefault();
        setLoading('Deleting Material please wait...')
        setError(false);
        setSuccess(false);
        deleteMaterial(_id,user._id,token,{url})
        .then(data=>{
            if(data.err){
                setLoading(false);
                setError('Error Deleting Material...')
                console.log(data.err)
            }
            else{
                setLoading(false)
                setError('Material Deleted Successfully...')
                console.log(data);
                findCourse();
            }
        })
        
    }

    const uploadMaterialBtn = (event) =>{
        event.preventDefault();
        setLoading('Material Uploading please wait...')
        setError(false);
        setSuccess(false);
        setTimeMat(Date.now());
        updatedCourseById(data._id,user._id,token,updateMaterial)
        .then(data=>{
            if(data.err){
                setLoading(false)
                setError('Error while uploading Material...')
                console.log(data.err);
            }
            else{
                setLoading(false);
                setSuccess('Material uploaded Successfully...')
                console.log('updated::',data);
                setupdateCourse(data.data);
                setUpdateMaterial(null)
                // findCourse();
            }
        })

    }

    const deleteImageBtn = (event) =>{
        event.preventDefault();
        setLoading('Deleting Image please wait...');
        setError(false);
        setSuccess(false);
        if(updateCourse.cimg){
            deleteImage(data._id,user._id,token)
            .then(data=>{
                if(data.err){
                    setLoading(false);
                    setError('Error deleting Image...')
                    console.log(data.err)
                }
                else{
                    setLoading(false);
                    setSuccess('Image Deleted Successfully...')
                    setupdateCourse(data);
                }
            })
        }

    }

    const removeMaterialInputBtn = (event)=>{
        event.preventDefault();
        setTimeMat(Date.now());
        setUpdateMaterial(null);
    }

    const uploadImageBtn = (event) =>{
        event.preventDefault();
        setLoading('Please wait Image Uploading...');
        setError(false);
        setSuccess(false);
        setTime(Date.now()+3);
        updatedCourseById(data._id,user._id,token,updateMaterial,image)
        .then(data=>{
            if(data.err){
                setLoading(false);
                setError('Error uploading Image...')
                console.log(data.err);
            }
            else{
                setLoading(false);
                setSuccess('Image Uploaded Successfully...')
                console.log(data);
                setupdateCourse(data.data);
                setImage(null);
            }
        })
    }

    const saveBtn = (event) =>{
        console.log("SAVEBTN");
        event.preventDefault();
        setTime(Date.now());
        setTimeMat(Date.now()+3);
        setSuccess(false);
        setError(false);
        setBtn(true)
        setLoading('Updating Course...');
        updatedCourseById(data._id,user._id,token,updateMaterial,image,updateCourse,tags)
        .then(data=>{
            if(data.err){
                console.log(data.err);
                setLoading(false);
                setBtn(false)
                setError('Error while updating course...')
            }
            else{
                setLoading(false)
                setSuccess('Course updated Successfully...');
                console.log(data.data);
                setupdateCourse(data.data);
                setImage(null);
                setBtn(false)
                setUpdateMaterial(null);
            }
        })

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

    //
    const onDocumentLoadSuccess=({numPages})=>{
        setNumPages(numPages)
    }

    const editCourse = ()=>{
        console.log('RENDER...')
        console.log('cname..',cname)
        return(
            <div className='center bg-transparent'>
            <form className='form-edit justify-content-center bg-transparent'>
                <label className='p-2 m-2  label-form'>Course Name *</label>
                <input
                type='text'
                className='p-2 m-2'
                placeholder='course name'
                disabled={btn}
                // defaultValue={cname}
                value={cname}
                onChange={handelChange("cname")}
                />

                <label className='p-2 m-2 bg-transparent label-form'>Description *</label>
                <textarea
                type='textarea'
                className='p-2 m-2'
                maxLength='200'
                disabled={btn}
                placeholder='course description'
                // defaultValue={description}
                value={description}
                onChange={handelChange('description')}
                />
                
                <label className='p-2 m-2 bg-transparent label-form'>Price *</label>
                <input
                type='number'
                className='p-2 m-2'
                placeholder='course price'
                // defaultValue={price}
                disabled={btn} 
                value={price}
                onChange={handelChange('price')}
                />

                <label className='p-2 m-2 bg-transparent label-form'>Category *</label>
                <select
                value={selected}
                className='p-2 m-2'
                disabled={btn}
                onChange={handelChange("category")}
                >
                {
                    categories.map(item=>{
                        return(
                            <option key={item._id} value={item.name}>
                            {item.name}
                            </option>
                        )
                    })
                }
                </select>

                <label className='p-2 m-2 bg-transparent label-form'>Course Material</label>
                {material && (updateCourse.material.map(file=>{
                    var s = file;
                    s = s.split('Biblioklept');
                    return (
                        <div key ={file} className='d-flex justify-content-between p-2 m-2'>
                            <div>
                                <FaFilePdf className="pdf-icon" size={30}/>
                                <a className='  m-2 text-decoration-none' href={file}>{s[1]}</a>
                            </div>
                            <div>
                                <a className='p-2 m-4 text-decoration-none button-a rounded text-white' href={file}>View</a>
                                <button className='p-1 rounded del-button' disabled={btn} onClick={(e)=>deleteMaterialBtn(e,file)}>Delete</button>
                            </div>
                        </div>
                    )
                }))}
                <div className='d-flex justify-content-between p-2 m-2 align-items-center'>
                    <input
                    label='course price'
                    type='file' 
                    disabled={btn}
                    placeholder=' ex: 399'
                    className='p-1 d-block'
                    accept='.pdf'
                    key={timemat || null}
                    onChange={(e)=>handelChangeMaterial(e)}
                    multiple
                    />
                    
                    <div>
                        <button className='p-1 m-4 mt-0 mb-0 rounded button-a' disabled={btn} onClick={uploadMaterialBtn}>Upload</button>
                        <button className='p-1  rounded del-button' disabled={btn} onClick={removeMaterialInputBtn}>Remove</button>
                    </div>
                </div>
                <label className='p-2 m-2 bg-transparent label-form'>Course Image</label>
                <div className='d-flex flex-column m-2'>
                    <img className='course-img m-4 rounded' src={cimg} alt='No img found in Data Base'/>
                    <div className='m-4 mt-1 mb-1'>
                    <button className='del-button p-2 m-1 rounded' disabled={btn} onClick={deleteImageBtn}>Delete Image</button>
                    </div>
                    <div className='d-flex m-4 mt-0'>
                    <input
                    label='course price'
                    type='file' 
                    disabled={btn}
                    placeholder=' ex: 399'
                    className='p-1 d-block'
                    accept='.jpg, .png, .jpeg'
                    key={time || null}
                    onChange={(e)=>handelChangeImage(e)}
                    />
                    <button className='m-1 button-a p-2 rounded' disabled={btn} onClick={uploadImageBtn}>upload</button>
                    </div>
                </div>
                <label className='p-2 m-2 label-form'> Tags</label>
                <div className='bg-transparent tagclass'>
                <TagsInput
                 value={tags}
                 onChange={handelTags}
                 disabled={btn}
                 />
                </div>
                 <div className='w-100 d-flex justify-content-center bg-transparent'>
                 <button className='save-btn m-2 mt-5 p-2 border-transparent rounded' disabled={btn} onClick={saveBtn}>SAVE</button>
                 <Link to='/admin/dashboard' className='homeLink m-2 mt-5 p-2 text-center text-white rounded text-decoration-none'>ADMIN HOME</Link>
                 </div>
                </form>
            </div>
        )
    }
    return (
        <Base title='Edit Course,' description={name}>
        {loadingMessage()}
        {successMessage()}
        {errorMessage()}
        <h4 className='p-2 h4 text-center'>EDIT COURSE</h4>
        {editCourse()}
        </Base>
    )
}

export default CourseEdit;



//  <TagsInput
//  value={tags}
//  onChange={handelChangeTags}
//  />

//  <TagsInput
                // value={tags}
                // onChange={handelChangeTags}
                // />

















//   <Document
//                 file={{
//                     url:updateCourse.material[1],
//                     header: {
//                     'Access-Control-Allow-Origin': '*',
//                     crossOrigin: 'anonymous',
//                 },}}
//                 onLoadSuccess={onDocumentLoadSuccess}
//                 onLoadError={console.error}
//                 >
//                 <Page pageNumber={pageNumber}/>
                
//                 </Document>