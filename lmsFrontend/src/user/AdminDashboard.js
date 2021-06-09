import React from 'react'
import Base from '../core/Base'
import {Link} from 'react-router-dom'
import './admin.css'
import {isAuthenticated} from '../auth/helper'
const AdminDashboard=() =>{
    //TO UNDO HERE
    // const {
    //     user : {name,email,role}
    // } = isAuthenticated()

    const adminLeftSide = ()=>{
        return(
            <div className="adminleft">
                <ul>
                    <h4>Admin Navigation</h4>
                    <li>
                        <Link to='/admin/create/category' className='leftlist nav-link text-white'> Create course Category </Link>
                    </li>
                    <li>
                        <Link to='/admin/create/course' className='leftlist nav-link text-white'> Create course </Link>
                    </li>
                    <li>
                        <Link to='/learn' className='leftlist nav-link'> View all Courses</Link>
                    </li>
                    <li>
                        <Link to='/admin/update/course' className='leftlist nav-link text-white'> Update Course</Link>
                    </li>
                    <li>
                        <Link className='leftlist nav-link text-white'> Create subcourse</Link>
                    </li>
                    <li>
                        <Link className='leftlist nav-link text-white'> update / delete category</Link>
                    </li>
                </ul>
            </div>
        )
    }

    const adminRightSide=()=>{
        return(
            <div className='adminright bg-transparent'>
                <ul>
                <h4>Admin Information</h4>
                    <li className='rightlist'>
                        <span className='badge bg-primary mr- p-1'>Name:</span>
                        
                    </li>
                    <li className='rightlist'>
                        <span className="badge bg-success mr-2 p-1">Email:</span>
                         
                        
                    </li>
                    <li className='rightlist'>
                        <span className="badge bg-danger mr-2 p-1">Admin Area</span>
                    </li>

                </ul>
            </div>
        )
    }
    return (
        <Base title='Welcome,' description="Admin Dashboard">
            <div className='admin bg-transparent'>
            {adminLeftSide()}
            {adminRightSide()}
            </div>
        </Base>
    )
}

export default AdminDashboard;