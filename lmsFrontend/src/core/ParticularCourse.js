import React,{useEffect,useState} from 'react'
import Base from './Base'
import {courseById} from '../admin/helper/adminapicalls'


const ParticularCourse=(props)=> {
    const item = props.location.state;
    const [course,setCourse] = useState(null);
    console.log(item)

    useEffect(() => {
        courseById(item._id)
        .then(async data=>{
            if(data.err){
                console.log(data.err)
            }
            else{
                await setCourse(data)
            
            }
        })
        .catch()
    }, []);

    console.log(course)

    const courseDetails=()=>{
        return(

            <div>
                <h4>{item.name}</h4>
                <p></p>
            </div>
        )
    }

    return (
        <Base title='Course /' description={item.name}>
        {courseDetails()}
        </Base>
    )
}

export default ParticularCourse;
