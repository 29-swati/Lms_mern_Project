import {useState} from 'react'
import logo from '../../src/Lets-Learn-Tech-Logo1-1.png'
import './user.css'
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router-dom'
import {signin,authenticate,isAuthenticated} from '../auth/helper/index'


import React from 'react'

const Signin =()=> {
    const [values,setValues] = useState({
        email:'a@gmail.com',
        password:'Admin@123',
        error:'',
        loading:false,
        didRedirect:false
    })
    const { email,password,error,loading,didRedirect} = values
    const {user} = isAuthenticated()
    
    const onHandelChange = data =>event=>{
        setValues({...values,error:false,[data]:event.target.value})
    }

    const onSubmit = (event)=>{
        event.preventDefault();
        setValues({...values,error:false,loading:true})
        signin({email,password})
        .then(data=>{
            console.log(data)
            console.log(data.error)
            if(data.error){
                setValues({...values,error:data.error,loading:false})
            }
            else{
                authenticate(data,()=>{
                    setValues({
                        ...values,
                        didRedirect:true
                    })
                })
            }
        })
        .catch(console.log('signin request failed'))
    }

    const errorMessage=()=>{
        if(values.error){
            return(
                <div className='alert font-weight-bold alert-danger m-2 info'>
                {values.error}
                </div>
                
            )
        }
    }

    const loadingMessage=()=>{
        return (
            loading && (
                <div className='alert alert-info font-weight-bold m-2 '>
                Loading...
                </div>
            )
        )
    }

    const signInForm = ()=>{
        return(
            <div>
                <form className='signinform'>
                <label>Email</label>
                    <div>
                        <input
                        type='email'
                        className='signininput sgninput'
                        placeholder='Email'
                        value={email}
                        onChange={onHandelChange("email")}
                        />
                    </div>
                    <label>Password</label>
                    <div>
                        <input
                        type='password'
                        className='signininput sgninput'
                        placeholder='password'
                        value={password}
                        onChange={onHandelChange("password")}
                        />
                    </div>
                    <button onClick={onSubmit}>Sign In</button>
                </form>
            </div>
        )
    }

    const performRedirect =()=>{
        if(didRedirect){
            if(user && user.role===1){
                return <Redirect to='/admin/dashboard'/>
            }
            else{
                return <Redirect to='/user/dashboard'/>
            }
        }
    }

    return (
        <div className='d-flex main flex-column align-items-center justify-content-center'>
            <img className='logo' src={logo} alt='img'/>   
            <div className='signin'>
                <h1>Welcome Back</h1>
                <h4>Don't have an account?
                <Link to='/signup' className='signin-link'> Sign Up</Link>
                </h4>
            </div>
             {loadingMessage()}
             {errorMessage()}
             {signInForm()}
             {performRedirect()}
        </div>
    )
}
export default Signin; 
