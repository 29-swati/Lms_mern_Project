import React,{useState,useEffect} from 'react'
import Base from './Base'
import Menu from './Menu'
import './allcourses.css'
import {AiOutlineSearch} from "react-icons/ai";
import {IconContext} from 'react-icons'
import {getallCourses,searchCourseByName,searchCourseByTags} from './helper/coreapicalls'
import {Link} from 'react-router-dom'
import TagsInput from 'react-tagsinput'

const AllCourses=()=> {
    const [count,setCount] = useState(0);
    const [course,setCourses] = useState([]);
    const [width,setWidth] = useState(window.innerWidth)
    const [searchName,setSearchName] = useState('')
    const [searchTags,setSearchTags] = useState(['react','webiste','web development'])
    const [searchedValue,setSearchedValue] = useState('')

    useEffect(() => {
        setSearchedValue(null)
        listOfAllCourses();
    }, []);

    useEffect(() => {
        const wbrowser = ()=>{
            console.log(window.innerWidth);
            setWidth(window.innerWidth)
        }
       window.addEventListener('resize',wbrowser)
        return () => {
      window.removeEventListener('resize', wbrowser)
    }

    }, [width]);

    useEffect(() => {
        console.log('love cheap thrills')
    }, [course]);

    const handelTags = (tags)=>{
        setSearchTags(tags)
        console.log(searchTags)
        console.log('hello')
        searchCourseByTags(searchTags)
        .then(data=>{
            if(data.err){
                console.log(data.err)
            }
            else{
                console.log(data)
                setCourses(data);
                setCount(data.length)
            }
        })
        
    }
    const listOfAllCourses = ()=>{
        const arr=[];
        getallCourses()
        .then(data=>{
            if(data.error){
                console.log(data.error)
            }
            else{
                data.map(item=>{
                    arr.push({_id:item._id,cname:item.cname,description:item.description,price:item.price,cimg:item.cimg})
                })
                // arr.push({id:'1',name:'DOCKER',description:'Docker is a popular open-source project written in go and developed by Dotcloud (A PaaS Company). It is basically a container engine that uses the Linux Kernel features like namespaces and control groups to create containers on top of an operating system.', price:'1200'})
                // arr.push({id:'2',name:'DOCKER',description:'Docker is a popular open-source project written in go and developed by Dotcloud (A PaaS Company). It is basically a container engine that uses the Linux Kernel features like namespaces and control groups to create containers on top of an operating system.', price:'1200'})
                // arr.push({id:'1',name:'DOCKER',description:'Docker is a popular open-source project ', price:'1200'})
                // arr.push({id:'1',name:'DOCKER',description:'Docker is a popular open-source project written in go and developed by Dotcloud (A PaaS Company). It is basically a container engine that uses the Linux Kernel features like namespaces and control groups to create containers on top of an operating system.', price:'1200'})
                setCourses(arr);
                setCount(arr.length)
            }
        })
    }

    
    
    const displayCourses = ()=>{
        return(
            <div className='bg-transparent'>
            {searchedValue && course.length!=0 && <h3 className=' p-2 bg-transparent'>Search result for '{searchedValue}' in courses</h3>}
            {searchedValue && course.length==0 && <h3 className='p-2 bg-transparent'>No search Result for '{searchedValue}' in courses</h3>}
            <h3 className='bg-transparent m-2 pt-4'>Courses <span className='badge-class'>{count}</span></h3>
                    <form className='form-tags'>
                        <TagsInput
                        value={searchTags}
                        onChange={handelTags}
                        placeholder={'filter by tags'}
                        />
                    </form>
                <div className='outer-course'>
                     {course.map(data=>{
                         if(!data.cimg){
                        data.cimg='https://leverageedu.com/blog/wp-content/uploads/2019/08/Course-after-MBA.png'
                    }
                         return (
                              <Link to={`/learn/${data.cname}`} className='text-decoration-none'>
                              <div className='inner-course'>
                              <div className='bg-transparent'>
                                <img className='bg-transparent course-img' src={data.cimg} alt='img'/>
                              </div>
                                <div className='outer-cart bg-transparent'>
                                    <div className='m-4 mt-0 mb-0 bg-transparent'>
                                    <h5 className='card-title bg-transparent font-weight-bold'>{data.cname}</h5>
                                    <p className='card-text bg-transparent'>
                                    {width<300 && data.description.substring(0,20)}
                                    {width>829 && data.description}
                                    {(width<829 && width>300) && data.description.substring(0,70)}...
                                    </p>
                                    <h5 className='card-title bg-transparent '>₹{data.price}</h5>
                                    </div>
                                </div>
                             </div>
                            </Link>
                        )
                     })
                     }
                </div>
            </div> 
        )

    }

    const searchFormSubmit = (event)=>{
        event.preventDefault();
        setSearchedValue(null)
        if(searchName){
            setSearchedValue(searchName);
        searchCourseByName(searchName)
        .then(data=>{
            if(data.err){
                console.log(data.err)
            }
            else{
                console.log("DATA::",data)
                setCourses(data);
                setCount(data.length)
            }
        })}
        else{
            listOfAllCourses();
            console.log('empty')
        }
    }

    const searchForm = ()=>{
        return (
            <div className='d-flex align-items-center search'>
                <form className='searchform bg-transparent' onSubmit={searchFormSubmit}>
                <input
                className='p-2'
                type='text'
                placeholder='search by product title'
                value={searchName}
                onChange={(e)=>{setSearchName(e.target.value)
                }}
                />
                </form>
                <IconContext.Provider value={{ size: '50px' }}>
                    <button className='btnbg' onClick={searchFormSubmit}>
                        <AiOutlineSearch size={30} className='bg-transparent m-2'/>    
                    </button>   
                </IconContext.Provider>
            </div>
        )

    }

    return (
        <div className='bg-transparent'>
        <Base title='All Courses' description='' menuChildren={searchForm()}>
            {displayCourses()}
        </Base>

        </div>
        
    )
}

export default AllCourses;



// value={searchTags}
//                         onChange={handelTags}