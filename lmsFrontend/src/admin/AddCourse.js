import React,{useState,useEffect} from 'react'
import Base from '../core/Base'
import './course.css'
import TagsInput from 'react-tagsinput'
import {isAuthenticated} from '../auth/helper/index'
import {allcategories} from './helper/adminapicalls'
import {createCourse} from './helper/adminapicalls'


const AddCourse=() =>{
    const [category,setCategory] = useState({selectedItem:'select category',array:[]})
    const [catId,setCatId] = useState('')
    const [time,setTime] = useState(null)
    const [timemat,setTimeMat] = useState(null)
    const [image,setImage] = useState({images:null})
    const [material,setMaterial] = useState({mat:null})
    const [error,setError] = useState(false)
    const [success,setSuccess]= useState(false)
    const [loading,setLoading]= useState(false)
    const [tags,setTags] = useState([])
    const [btn,setBtn] = useState(false)
    const [course,setCourse] = useState({
        name:'',
        description:'',
        price:'',
        loading:false,
        error:'',
        success:''
    })

    const {user,token} = isAuthenticated();
    
    const {name,description,price} = course;

    const onHandelChange= data => event =>{
        setError(false)
        setSuccess(false)
        setCourse({...course,[data]:event.target.value})
    }

    const onSubmit = (event)=>{
        setError(false)
        setLoading(true)
        setSuccess(false)
        setBtn(true)
        setCourse({...course})
        event.preventDefault();
        createCourse(user._id,token,name,description,price,catId,image,material,tags).
        then(data=>{
            if(data.err){
                console.log(data.err)
                setLoading(false)
                setSuccess(false)
                setBtn(false)
                setError('Please fill all the details marked with astrik (*)...')
            }
            else{
                setSuccess(true)
                setLoading(false)
                setError(false)
                setBtn(false)
                setTime(Date.now())
                setTimeMat(Date.now()+3)
                setMaterial({mat:null})
                setImage({images:null})
                console.log(data)
                setTags([])
                setCourse({name:'',price:'',description:''})
            }
            setMaterial({mat:null})
            setImage({images:null})
        }).catch(err=>
            console.log(err)
        )
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

    const loadingMessage=()=>{
        if(loading){
             return(
                <div>
                <h5 className='alert font-weight-bold alert-success text-center'>LOADING...</h5>
                </div>
                
            )
        }
    }

    const successMessage = ()=>{
        if(success){
             return(
                <div>
                <h5 className='alert font-weight-bold alert-success text-center'>Course Created Successfully...</h5>
                </div>
                
            )
        }
    }

    useEffect(()=>{
        const arr=[];
        allcategories()
        .then(data=>{
            if(data){
                data.map(item=>{
                    arr.push({key:item._id,value:item.name});
                })
                setCategory({...category,array:arr})
            }
        }).catch(err=>
            console.log(err))
    },[])
    
    const uploadImage=(e)=>{
        console.log(e.target.files[0])
        setImage({images:e.target.files[0]})
    }

    const materialUpload = (e) =>{
        console.log(e.target.files)
        const files = Array.from(e.target.files)
        setMaterial({mat:files})
    }

    const handelTags = (tags)=>{
        setTags(tags)
        console.log(tags)
    }
    // console.log(tags)
    // console.log(catId)
    return (
        <Base title='welcome,' description='create a new course'>
            {loadingMessage()}
            {errorMessage()}
            {successMessage()}
            <div className='box bg-transparent'>
                <h4 className='h4 p-2'>CREATE COURSE</h4>
                <form className='form bg-transparent'>
                    <label className='p-2 m-2'> 
                        Course Name *
                    </label>
                    <input
                    label='course name'
                    type='text' 
                    placeholder='ex: Aws'
                    className='p-2 m-2'
                    disabled={btn}
                    value={name}
                    onChange={onHandelChange("name")}    
                    />

                    <label className='p-2 m-2'>
                    Course Description *
                    </label>

                    <input
                    label='course description'
                    type='text' 
                    placeholder='description (max 200)'
                    className='p-2 m-2'
                    maxLength='200'
                    disabled={btn}
                    value={description}
                    onChange={onHandelChange("description")}
                    />

                    <label className='p-2 m-2'>
                    Price *
                    </label>

                    <input
                    label='course price'
                    type='number' 
                    placeholder=' ex: 399'
                    className='p-2 m-2'
                    disabled={btn}
                    value={price}
                    onChange={onHandelChange("price")}
                    />

                    <label className='p-2 m-2'>
                    Category *
                    </label>
                    
                    <select 
                    disabled={btn}
                    value={category.selectedItem}
                    onChange={(e)=>{setCategory({...category,selectedItem:e.target.value})
                    setCatId(()=>{
                        const data = category.array.filter(item=>{
                            if(item.value===e.target.value){
                                return item.key;
                            }
                        })
                        return data[0].key;
                    }
                    )
                    }}
                    className='p-2 m-2'
                    >
                     {category.array.map(({key,value})=>(
                        <option key={key} value={value}>
                            {value}                        
                        </option>
                    ))
                    }
                    </select>

                    <label className='p-2 m-2'>
                        Course Image
                    </label>

                    <input
                    disabled={btn}
                    label='course Image'
                    type='file' 
                    placeholder=' ex: 399'
                    className='p-2 m-2'
                    key={time|| ''}
                    accept=".jpeg, .jpg, .png"
                    onChange={(e)=>{uploadImage(e)}}
                    />
                    
                    <label className='p-2 m-2'>
                        Course Material
                    </label>
                    
                    <input
                    disabled={btn}
                    label='course price'
                    type='file' 
                    placeholder=' ex: 399'
                    className='p-2 m-2'
                    accept='.pdf'
                    key={timemat|| null}
                    onChange={(e)=>{materialUpload(e)}}
                    multiple
                    />

                    <label className='p-2 m-2'>
                        Tags
                    </label>
                    <TagsInput
                    disabled={btn}
                    value={tags}
                    onChange={handelTags}           
                    />
                   

                </form>
                <button className='butn m-2 p-2 border-transparent rounded' disabled={btn} onClick={onSubmit}>SUBMIT</button>
            </div>
        </Base>
    )
}

export default AddCourse;
