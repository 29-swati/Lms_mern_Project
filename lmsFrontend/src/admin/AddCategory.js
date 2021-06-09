import React,{useState} from 'react'
import Base from '../core/Base'
import {Link} from 'react-router-dom'
import './category.css'
import {addCategory} from './helper/adminapicalls'
import {isAuthenticated} from '../auth/helper/index'

const AddCategory=()=> {
    const [name,setName] = useState('')
    const [error,setError] = useState(false)
    const [success,setSuccess] = useState(false)
    const {user,token} = isAuthenticated();


    const onSubmit =(event)=>{
        event.preventDefault();
        setError(false)
        setSuccess(false)

        addCategory(user._id,token,{name})
        .then(data=>{
            console.log(data)
            if(data.error){
                console.log(data.error)
                if(name==''){
                    setError('please enter something!!!')
                }
                else{
                    setError('Category already exist!!!')
                }
            }
            else{
                setError(false)
                setSuccess(true)
            }
            setName('')
        })
        return console.log(name)
    }
    
    const errorMessage= ()=>{
        if(error){
            return(
                <div className=' alert alert-danger text-center font-weight-bold'>
                    {error}
                </div>
            )
        }
    }

    const successMessage= ()=>{
        if(success){
            return (
                <div className='alert alert-info font-weight-bold text-center'>
                    category created successfully !!!
                </div>
            )
        }
    }
    
    const categorybox = ()=>{
        return (

            <div className='addcategory bg-transparent'>
                <h4 className='bg-transparent'>CREATE CATEGORY</h4>
                <form onSubmit={onSubmit}>
                    <div className='bg-transparent'>
                        <input
                        type='text'
                        placeholder='ex: aws'
                        className='border rounded'
                        value={name}
                        onChange={(e)=>{setName(e.target.value)
                            setError(false)
                            setSuccess(false)
                        }}
                        />
                    </div>
                    <div className='bg-transparent'>
                    <button onClick={onSubmit}> create Category</button>
                    </div>
                </form>
                <div className='mt-4 bg-transparent'>
                    <Link to='/admin/dashboard' className='catLink rounded p-2 text-white text-decoration-none'>ADMIN HOME</Link>
                </div>
            </div>
        )
    }

    return (
        <Base title='Create Category' description='unique categories would be created '>
            {errorMessage()}
            {successMessage()}
            <div className='row bg-transparent rounded'>
                <div className='col-md-8 bg-transparent offset-md-2 p-4'>
                    {categorybox()}                
                </div>
            </div>
        </Base>
    )
}

export default AddCategory;