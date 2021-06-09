import { from } from 'form-data'
import React,{useState,useEffect} from 'react'
import Base from '../core/Base'
import './updatecourse.css'
import {AiOutlineSearch} from 'react-icons/ai'
import { IconContext } from 'react-icons/lib'
import {getallCourses} from '../core/helper/coreapicalls'
import {Link} from 'react-router-dom'
import {searchCourseByName} from '../core/helper/coreapicalls'
import '../core/learn.css'
import {useHistory} from 'react-router-dom'


const UpdateCourse =() =>{
    const [course,setCourse] = useState([])
    const [seacrchValue,setSearchValue] = useState('');
    const [count,setCount] = useState(0)
    const [info,setInfo] = useState('')

    useEffect(() => {
        setInfo(null)
        listOfAllCourses();
    }, []);
    
    const listOfAllCourses = ()=>{
        const arr=[]
        getallCourses()
        .then(data=>{
            if(data.err){
                console.log(data.err)
            }
            else{
                data.map(item=>{
                    arr.push({...item,_id:item._id,cname:item.cname,cimg:item.cimg,dexcription:item.description})
                })
                setCourse(data)
                setCount(data.length)
            }
        })
    }

    const searchFormSubmit = (event)=>{
        event.preventDefault();
        setInfo(null);
        if(seacrchValue){
            setInfo(seacrchValue)
            searchCourseByName(seacrchValue)
            .then(data=>{
                if(data.err){
                    console.log(data.err)
                }
                else{
                    setCourse(data);
                    setCount(data.length)
                }
            })
        }
        else{
            listOfAllCourses();
        }

    }

    const searchForm = ()=>{
        return (
            <div className='updatecourse rounded'>
            <form className='d-flex flex-row bd-highlight' onSubmit={searchFormSubmit}>
                <input
                type='text'
                placeholder='search course by title'
                className='w-100 p-2'
                value={seacrchValue}
                onChange={(e)=>setSearchValue(e.target.value)}
                />
                <IconContext.Provider value={{size:40}}>
                    <button className='' onClick={searchFormSubmit}>
                        <AiOutlineSearch className='bg-transparent'/>
                    </button>
                </IconContext.Provider>
            </form>
            </div>
        )
    }

    const displayAllCourses = ()=>{
        return(
            <section className='cocktails-center bg-transparent rounded'>
                {course.map(item=>{
                    if(!item.cimg){
                        item.cimg='https://leverageedu.com/blog/wp-content/uploads/2019/08/Course-after-MBA.png'
                    }
                    // console.log('ITEM:',item)
                    return(
                        <div key={item._id} className='each-card rounded'>
                           <div className='inner rounded'>
                            <img className='card-img-top' src={item.cimg} alt='card img cap'/>
                           </div>
                           <div className='card-body bg-transparent'>
                            <h5 className='card-title bg-transparent'>{item.cname}</h5>
                            <p className='card-text bg-transparent'>{item.description}</p>
                            </div>
                            <div className='page-footer rounded '>
                            <h4 className='bg-transparent'>₹{item.price}</h4>
                            <div className='d-flex flex-column justify-content-around bg-transparent'>
                                <Link 
                                to={{
                                    pathname: `/admin/updateCourse/${item.cname}`,
                                    myCustomProps: item,
                                    state:item
                                }} className='page-footer-link fs-6 text-decoration-none'>Update / Edit</Link>
                                <Link 
                                to={{
                                    pathname: `/admin/updatesubCourse/${item.cname}`,
                                    // myCustomProps: item,
                                    state:item
                                }} className='page-footer-link mt-2 fs-6 text-decoration-none'>Edit subcourse</Link>
                            </div>
                            </div>    
                        </div>
                    )
                })
                    
                }
            </section>

        )
    }

    return (
        <Base title='Update any Course' description=''>
            {searchForm()}
            {info && course.length!=0 && <h5 className=' p-2 bg-transparent'>Search result for '{info}' in courses</h5>}
            {info && course.length==0 && <h5 className='p-2 bg-transparent'>No search Result for '{info}' in courses</h5>}
            <h3 className='bg-transparent m-2 pt-4'>Courses <span className='badge-class'>{count}</span></h3>
            {displayAllCourses()}
        </Base>
    )
}

export default UpdateCourse;

