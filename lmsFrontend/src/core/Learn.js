import React,{useEffect,useState} from 'react'
import Base from './Base'
import './learn.css'
import {Link} from 'react-router-dom'
import {allcategories,getallCourses} from './helper/coreapicalls'
import { logRoles } from '@testing-library/dom'

const Learn=()=> {
    const [cat,setCat] = useState([])
    const [courseCount,setCourseCount] = useState(61)
    const [course,setCourse] = useState([])
    useEffect(() => {
        const arr = []
        allcategories()
        .then(data=>{
            if(data.err){
                console.log(data.err)
            }
            else{
                console.log(data)
                data.map(item=>{
                    arr.push({id:item._id,category:item.name})
                })
                // arr.push({id:'1',category:'Jenkins'})
                // arr.push({id:'2',category:'Ansible'})
                // arr.push({id:'3',category:'Teraform'})
                // arr.push({id:'4',category:'Podman'})

                setCat(arr);
            }
        })
        const details = [];
        getallCourses()
        .then(data=>{
            if(data.error){
                console.log(data.error)
            }
            else{
                console.log(data);
                data.map(item=>{
                    details.push({_id:item._id,name:item.cname,description:item.description,price:item.price,img:item.cimg})
                })
                // details.push({id:'1',name:'DOCKER',description:'Docker is a popular open-source project written in go and developed by Dotcloud (A PaaS Company). It is basically a container engine that uses the Linux Kernel features like namespaces and control groups to create containers on top of an operating system.', price:'1200'})
                // details.push({id:'2',name:'DOCKER',description:'Docker is a popular open-source project written in go and developed by Dotcloud (A PaaS Company). It is basically a container engine that uses the Linux Kernel features like namespaces and control groups to create containers on top of an operating system.', price:'1200'})
                // details.push({id:'1',name:'DOCKER',description:'Docker is a popular open-source project ', price:'1200'})
                // details.push({id:'1',name:'DOCKER',description:'Docker is a popular open-source project written in go and developed by Dotcloud (A PaaS Company). It is basically a container engine that uses the Linux Kernel features like namespaces and control groups to create containers on top of an operating system.', price:'1200'})
                
                setCourse(details)
                setCourseCount(details.length)
            }
        })
    }, []);
    // console.log(cat)
    console.log(course)
    const getCategories = () =>{
        return (
          <div className='bg-transparent mt-2'>
                {
                    cat.map(value=>{
                    console.log(value.category)
                        return (
                            <Link key={value.id} className='learn-Link text-white text-decoration-none rounded p-2'>{value.category}</Link>  
                        )
                    })}
          </div>
        )
    }
    const getCourses = ()=>{
        return (
            <section className='parent-card bg-transparent'>
                {course.map(item=>{
                    if(!item.img){
                        item.img='https://leverageedu.com/blog/wp-content/uploads/2019/08/Course-after-MBA.png'
                    }
                    return(
                        <div key={item._id} className='card-class rounded'>
                           <div className='inner rounded'>
                            <img className='card-img-top' src={item.img} alt='card img cap'/>
                           </div>
                           <div className='card-body bg-transparent'>
                            <h5 className='card-title bg-transparent'>{item.name}</h5>
                            <p className='card-text bg-transparent'>{item.description}</p>
                            </div>
                            <div className='page-footer '>
                            <h4 className='bg-transparent'>₹{item.price}</h4>
                            <Link 
                                to={{
                                    pathname:`/learn/${item.name}`,
                                    state:item                                
                                }} 
                                className='page-footer-link text-decoration-none'>
                                View More
                            </Link>
                            </div>
                            
                        </div>
                    )
                })
                    
                }
            </section>

        )
        

    }
    
    return (
        <Base title='Welcome to LetsLearnTech' description=''>
         <div className='bg-transparent learn'> 
         Categories
         {getCategories()}
         <div className='bg-transparent d-flex justify-content-between'>
            <h3 className='bg-transparent mt-5 pt-4'>Courses <span className='badge-class'>{courseCount}</span></h3>
            <Link to='/learn/allcourses' className='bg-transparent mt-5 pt-4 text-white text-decoration-none'><h5 className='bg-transparent'>View All</h5></Link> 
        </div>
         {getCourses()}
         </div>
        {console.log(cat)}
        </Base>
    )
}
export default Learn;

//<p className='card-text bg-transparent'>{item.description}</p>