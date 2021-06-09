import React,{useState} from 'react'
import {Switch,Route,BrowserRouter as Router} from "react-router-dom"
import Menu from './core/Menu'
import Signin from './user/Signin'
import Signup from './user/Signup'
import Base from './core/Base'
import Home from './core/Home'
import UserDashboard from './user/UserDashboard'
import {Link} from 'react-router-dom'
import AdminDashboard from './user/AdminDashboard'
import AdminRoute from './auth/helper/AdminRoutes'
import AddCategory from './admin/AddCategory'
import AddCourse from './admin/AddCourse'
import Learn from './core/Learn'
import AllCourses from './core/AllCourses'
import UpdateCourse from './admin/UpdateCourse'
import CourseEdit from './admin/CourseEdit'
import SubCourse from './admin/SubCourse'
import AddSubCourse from './admin/AddSubCourse'
import ParticularCourse from './core/ParticularCourse'



const Routes =() => {
    return (
        <Router>
            <Switch>
            <Route path='/' exact component = {Home} />
            <Route path='/Signin' exact component={Signin} />
            <Route path='/Signup' exact component={Signup}/>
            <Route path='/user/dashboard' exact component={UserDashboard}/>
            <AdminRoute path='/admin/dashboard' exact component={AdminDashboard}/>
            <AdminRoute path='/admin/create/category' exact component={AddCategory}/>
            <AdminRoute path='/admin/create/course' exact component={AddCourse}/>
            <AdminRoute path='/admin/update/course/'  exact component={UpdateCourse}/>
            <AdminRoute path={ `/admin/updateCourse/:courseName/`} exact component={CourseEdit} />
            <AdminRoute path={ `/admin/updatesubCourse/:courseName/`} exact component={SubCourse} />
            <AdminRoute path={ `/admin/createsubCourse/:courseName/`} exact component={AddSubCourse}/>
            <Route path='/learn' exact component={Learn}/>
            <Route path='/learn/allcourses' exact component={AllCourses}/>
            <Route path={`/learn/:courseName`} exact component={ParticularCourse}/>
            </Switch>       
        </Router>
    
    )
}

export default Routes;
// <Route path='/admin/create/category' exact component={AddCategory}/>
// <Route path='/admin/create/course' exact component={AddCourse}/>
//  <Route path='/admin/dashboard' exact component={AdminDashboard}/>
            // <Route path='/admin/create/category' exact component={AddCategory}/>