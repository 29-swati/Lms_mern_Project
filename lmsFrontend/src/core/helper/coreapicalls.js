import {API} from '../../backend'


//get all courses (everyone)
export const getallCourses = ()=>{
    return fetch(`${API}/courses`,{
        method:"get",
        headers:{
            Accept:'application/json',
            "content-type":'application/json'
        }
    }).then(response=>{
        return response.json();
    }).catch(err=>{
        console.log(err)
    })
}

//get all categories (everyone)
export const allcategories =()=>{
    return fetch(`${API}/categories`,{
        method:'get',
        headers:{
            Accept:'application/json',
            "content-type":'application/json'
        }
    }).then(response=>{
        return response.json()
    })
    .catch(err=>{
        console.log(err)
    })
}

//get courses by course name (everyone)
export const searchCourseByName = (cname) =>{
    return fetch(`${API}/search/name?q=${cname}`,{
        method:'get',
        headers:{
            Accept:'application/json',
            'content-type':'application/json'
        }
    }).then(response=>{
        return response.json();
    })
    .catch(err=>{
        console.log(err)
    })
}


//get courses bu course tags (everyone)

export const searchCourseByTags = (tags) =>{
    
    return fetch(`${API}/search/tags?q=${tags}`,{
        method:'get',
        headers:{
            Accept:'application/json',
            "content-type":'application/json'
        }
    }).then(response=>{
        return response.json()
    }).catch(err=>{
        console.log(err)
    })
}