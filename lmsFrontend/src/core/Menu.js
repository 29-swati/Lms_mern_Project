import React, { Fragment } from 'react'
import logo from '../../src/Lets-Learn-Tech-Logo1-1.png'
import './menu.css'
import {Link, withRouter} from 'react-router-dom'
import {isAuthenticated,signout} from '../auth/helper/index'

const currentTab = (history, path)=>{
    if(history.location.pathname===path){
        return {color:'#b033fa'}
    }
    else{
        return {color:'#FFFFFF'}
    }
}

const Menu=({ history,children })=> {
    // console.log(history)
    return (
        <div className="navbar-area">
        <img src={logo} alt='img' className='img'/>
            {children}
            <ul className=' nav-links m-2'>
                        <li>
                            <Link to='/' className='color nav-link bg-transparent m-1' style={currentTab(history,"/")} >Home <span className='bg-warning rounded p-1 pt-0 pb-0 m-0 h6 text-dark'>new</span></Link>
                        </li>
                        <li>
                            <Link to='/aboutus' className='color nav-link bg-transparent' style={currentTab(history,'/aboutUs')}>About Us</Link>
                        </li>
                        <li>
                            <Link to='/learn' className='color nav-link bg-transparent' style={currentTab(history,"/learn")}>Courses</Link>
                        </li>
                        <li>
                            <Link to='/livecourses' className='color nav-link bg-transparent' style={currentTab(history,"/liveCourses")}>Live Courses</Link>
                        </li>
                        <li>
                            <Link to='/more' className='color nav-link bg-transparent' style={currentTab(history,"/more")}>More</Link>
                        </li>
                         <li>
                            <a href='https://www.letslearntech.com/' className='text-white color nav-link bg-transparent'>Blog <span className='bg-warning rounded p-1 pt-0 pb-0 m-0 h6 text-dark'>new</span></a>
                        </li>
            </ul>
            {!isAuthenticated()&&(
                <Fragment>
                    <Link to='/signin' className='text-white nav-link login border rounded '>Login / Register</Link>
                </Fragment>    
            )}
            {isAuthenticated() && (
                <Fragment>
                    <span className='text-white login border rounded' onClick={()=>{
                        signout(()=>{
                            history.push("/")
                        })
                    }}>Sign Out</span>
                </Fragment>
            )}
        </div>
    )
}

export default withRouter(Menu)

// <li className=' container-item nav-item nav-btn'>
//                     <Link className='nav-link'> Home</Link>
//                 </li>
//                 <li className='container-item nav-item nav-btn'>
//                     <Link className='nav-link'> Aboutuss</Link>
//                 </li>