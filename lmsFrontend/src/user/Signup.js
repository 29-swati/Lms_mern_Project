import React,{useState} from 'react'
import logo from '../../src/Lets-Learn-Tech-Logo1-1.png'
import './user.css'
import {Link} from 'react-router-dom'
import {signup} from '../auth/helper/index'

const Signup = () =>{
    const [values,setValues] = useState({
        name:'',
        lastname:'',
        email:'',
        password:'',
        confirmPassword:'',
        error:'',
        success:false
    })

    const {name,lastname,email,password,confirmPassword,error,success} = values
    
    const handelChange = data=>event=>{
        setValues({...values,error:false,[data]:event.target.value})

    }

    const errorMessage=()=>{
        if(values.error){
            console.log(values.error)
            return(
                <div className='alert font-weight-bold alert-danger m-2 info'
                style={{display:error ?"" :"none"}}
                >
                {values.password!==values.confirmPassword?"Passwords don't match" : values.error}
                </div>
            )
        }
    }

    const successMessage=()=>{
        console.log(values.success)
        if(values.success){
            return (

                <div className='alert alert-success font-weight-bold m-2 info'
                style={{display:success ?'':"none"}}
                >
                Your Account was created successfully. Please 
                <Link to='/signin' className='alert-success'> Login Here</Link>
                </div>
            )
        }
    }
    const onSubmit = event=>{
        event.preventDefault();
        setValues({...values,error:false})
        signup({name,email,password,confirmPassword})
        .then((data)=>{
            console.log(data)
            console.log(data.err)
            if(data.err || data.error){
                if(data.err){
                    setValues({...values,error:'Email Already Exists',success:false})
                }
                else if(data.error[0].msg){
                    setValues({...values,error:data.error[0].msg,success:false})
                }
            }
            else{
                setValues({
                    ...values,
                    name:'',
                    email:'',
                    password:'',
                    confirmPassword:'',
                    success:true,
                    error:''
                })
            }
        })
        .catch((err)=>console.log(err))
    }

    const signUpForm = ()=>{
        return(
            <div>
                <form className='signinform'>
                <label>Email</label>
                    <div>
                        <input
                        type='email'
                        className='signininput'
                        placeholder='email'
                        value={email}
                        onChange={handelChange('email')}
        
                        />
                    </div>
                    <label>Password</label>
                    <div>
                        <input
                        type='password'
                        className='signininput'
                        placeholder='Password'
                        value={password}
                        onChange={handelChange('password')}
                        />
                    </div>
                    <label>Confirm Password</label>
                    <div>
                        <input
                        type='password'
                        className='signininput'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={handelChange('confirmPassword')}
                        />
                    </div>
                    <button onClick={onSubmit}>SIGN UP</button>
                </form>
            </div>
        )
    }
    return (
        <div className='d-flex main flex-column justify-content-center align-items-center align-self-center'>
            <img className='logo' src={logo} alt='img'/>   
            <div className='signin'>
                <h1>Create your account</h1>
                <h4>Already have an account?
                <Link to='/signin' className='signin-link'> Sign In</Link>
                </h4>
            </div>
            {successMessage()}
            {errorMessage()}
             {signUpForm()}
        </div>
    )
}

export default Signup;