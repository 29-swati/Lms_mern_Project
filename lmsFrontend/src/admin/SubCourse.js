import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import Base from '../core/Base'
import {MdDelete,MdEdit} from 'react-icons/md'
import {RiArrowDropDownLine} from "react-icons/ri";
import {IconContext} from 'react-icons/lib'
import DropDown from './DropDown'
import {courseById} from '../admin/helper/adminapicalls'
import './dropdown.css'
const SubCourse=(props)=> {
    const name = props.match.params.courseName;
    const data = props.location.state;
    const subdetails = data.sub
    const [sub,setSub] = useState([]);

    // console.log(data)
    console.log(sub)

    useEffect(() => {
        console.log('hey::::')
        courseById(data._id)
        .then(data=>{
            if(data.err){
                console.log(data.err)
            }
            else{
                console.log('cou::',data.sub)
                const obj=data.sub
                setSub(obj);
                console.log(sub)
            }
        })
    }, []);

    const subCourseForm = ()=>{
        console.log(sub);
        return (
            <div className='bg-transparent'>
            {
                sub.map(item=>{
                    return (
                        <div className='bg-transparent d-flex flex-column'>
                        <DropDown key={item._id} {...item}/>
                        </div>
                    )
                })
            }
            </div>
        )
    }

    return (
        <Base title='Edit SubCourse,' description={name}>
        <h4 className='h4 p-2'>SUB - COURSES</h4>
            {subCourseForm()}
            <div className='mt-5 bg-transparent d-flex flex-column justify-content-between'>
                <div className='bg-transparent'>
                    <Link to={{
                        pathname:`/admin/createsubCourse/${data.cname}`,
                        state:data
                    }} 
                    className='p-2 m-2  drop-h drop-sublink  rounded text-decoration-none '>
                    Create New SubCourse
                    </Link>
                </div>
                <div className='bg-transparent mt-5'>
                <Link to='/admin/dashboard' className='homeLink m-2 mt-5 p-2 text-center text-white rounded text-decoration-none'>ADMIN HOME</Link>
                </div>
               
            </div>
        </Base>
    )
}

export default SubCourse;
// {sub.map(item=>{
//                 const videos = item.videos;
//                 i = i+1;
//                 item.num = i;
//                 console.log('ITEM:',item)
//                 return (
//                     <form key={item._id} className='p-2 m-2 bg-transparent'>
//                         <div>
//                             <input
//                             type='text'
//                             placeholder='subCourse Title'
//                             className='p-2'
//                             defaultValue={item.name}
//                             />
//                             <IconContext.Provider value={{size:35}}>
//                                 <MdEdit size={30}/>
//                                 <button className='bg-transparent button-a border-none' onClick={(e)=>close(e,item.num)}>
//                                     <RiArrowDropDownLine size={30}/>
//                                 </button>
//                             </IconContext.Provider>
//                         </div>
//                         {open && (
//                             <div>
//                             <div className='bg-transparent'>
//                                 <input
//                                 type='text'
//                                 placeholder='subCourse Title'
//                                 className='p-2'
//                                 defaultValue={item.description}
//                                 />
//                                 <MdEdit/>
//                             </div>
//                             <div className='bg-transparent'>
//                                 {videos.map(file=>{
//                                     var s = file;
//                                     s = s.split('Biblioklept');
//                                     return (
//                                         <div className='p-2 mt-1'>
//                                         <a href={file}
//                                         className='p-2 m-2'
//                                         >
//                                         {s[1]}</a>
//                                         <a className='p-2 m-4 text-decoration-none button-a rounded text-white' href={file}>View</a>
//                                         <button className='p-1 rounded del-button'>Delete</button>
//                                         </div>
//                                     )
//                                 })}
//                             </div>
                        
//                             </div>
//                         )}
//                     </form>
//                 )
//             })}