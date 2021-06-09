import {API} from '../../backend'
import FormData from 'form-data'

export const addCategory = (userId,token,name) =>{
    console.log(JSON.stringify(name))
    return fetch(`${API}/category/create/${userId}`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "content-type":"application/json",
            authorization:`Bearer ${token}`
        },credentials: 'include',
        body: JSON.stringify(name)
    }).then((response) =>{
        try {
            return response.json();
            
        } catch (error) {
            console.log(error)
        }
    }
    )
    .catch(err=> console.log(err))
} 


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

export const createCourse = (userId,token,name,description,price,catId,image,material,tags)=>{
    //TODO
    var form = new FormData();
    form.append('cname',name);
    form.append('description',description)
    form.append('price',price)
    form.append('category',catId)
    console.log(image,material,tags)
    if(image){
        console.log('hello');
        console.log(image.images);
        form.append('cimg',image.images)
    }
    if(material){
        console.log(material.mat)
        if(material.mat){
           for(let i=0;i<material.mat.length;i++){
                form.append('material',material.mat[i]);
            }
    }
    }
    if(tags){
        console.log('TAGS::',tags)
        for(let i=0;i<tags.length;i++){
            form.append('tags',tags[i])
        }
    }
    console.log(form)
    for (var value of form.values()) {
   console.log(value); 
}
for (var pair of form.entries()) {
    console.log(pair[0]+ ', ' + pair[1]); 
}
    return fetch(`${API}/course/create/${userId}`,{
        method:'post',
        headers:{
            authorization:`Bearer ${token}`
        },credentials:'include',
        body:form,     
    }).then(response=>{
        return response.json();
    }).catch(err=>{
        console.log(err)
    })
}


//get category name by id
export const getCategoryByID = (id)=>{
    return fetch(`${API}/category/${id}`,{
        method:'get',
        headers:{
            Accpet:'application/json',
            "content-type":'application/json'
        }
    }).then(response=>{
        return response.json();
    }).catch(err=>{
        console.log(err)
    })
}

//delete any particular material from database (by Admin)
export const deleteMaterial = (courseId,userId,token,url) =>{
    // console.log('COURSEID:',courseId)
    // console.log('USERID:',userId)
    // console.log("token:",token)
    // console.log(JSON.stringify(url))
    // console.log(url)
    return fetch(`${API}/course/material/${courseId}/${userId}`,{
        method:'DELETE',
        headers:{
            Accept:'application/json',
            'content-type':'application/json',
            authorization:`Bearer ${token}`,
        },credentials:'include',
        body:JSON.stringify(url)
    })
    .then(response=>{
        console.log(response);
        return response.json()
    })
    .catch(err=>{
        console.log("ERR MAT::",err)
    })
}

//get course by id(everyone)
export const courseById = (id) =>{
    return fetch(`${API}/course/${id}`,{
        method:'get',
        headers:{

        }
    }).then(response=>{
        return response.json();
    }).catch(err=>{
        console.log(err);
    })

}

//update course by ADMIN
export const updatedCourseById = (cid,uid,token,material,img,updateCourse,tags,subCourse)=>{
    var form = new FormData();
    console.log('cVideo:',subCourse.videos)
    if(updateCourse){
        const {cname,description,price,category} = updateCourse;
        if(cname){
            console.log('CNAME:',cname)
            form.append('cname',cname)
        }
        if(description){
            console.log('DES:',description)
            form.append('description',description)
        }
        if(price){
            console.log('price:',price);
            form.append('price',price)
        }
        if(category){
            console.log('cat::',category);
            form.append('category',category);
        }

    }
    if(material){
        console.log(material)
        if(material){
           for(let i=0;i<material.length;i++){
                form.append('material',material[i]);
            }
        }
    }
    if(img){
        console.log(img)
        form.append('cimg',img);
    }
    if(tags){
        for(let i=0;i<tags.length;i++){
            form.append('tags',tags[i])
        }
    }
    // if(subCourse){
    //     console.log(JSON.stringify(subCourse))
    //     form.append(JSON.stringify(subCourse))
    // }
    console.log('subCourse',subCourse)
    for(var key in subCourse){
        if(key==='videos'){
            for(let i=0;i<subCourse[key].length;i++){
                // console.log(key,subCourse[key])
                form.append(`sub[${key}]`,subCourse[key][i]);
            }
        }
        else{
        form.append(`sub[${key}]`,subCourse[key])
        }
    }

    return fetch(`${API}/course/${cid}/${uid}`,{
        method:'PUT',
        headers:{
            authorization:`Bearer ${token}`
        },credentials:'include',
        body:form,
    }).then(response=>{
        // console.log(response);
        return response.json();
    }).catch(err=>{
        console.log(err)
    })

}



//delete course image from DB 
export const deleteImage = (cid,uid,token) =>{
    return fetch(`${API}/course/image/${cid}/${uid}`,{
        method:"DELETE",
        headers:{
            authorization:`Bearer ${token}`,
        },credentials:'include',
        
    }).then(response=>{
        return response.json();
    }).catch(err=>{
        console.log(err)
    });

}

//create subCourse
export const createSubCourse = (cid,uid,token,subcourse,video)=>{
    var form = new FormData();
    const {name,description} = subcourse;
    if(name){
        console.log('name:',name)
        form.append('name',name);
    }
    if(description){
        form.append('description',description)
    }
    if(video){
         for(let i=0;i<video.length;i++){
                form.append('videos',video[i]);
            }
    }
    form.append('course',cid)
    return fetch(`${API}/sub/create/${cid}/${uid}`,{
        method:'POST',
        headers:{
            authorization:`Bearer ${token}`,
        },credentials:'include',
        body:form
    }).then(response=>{
        console.log(response)
        return response.json();
    }).catch(err=>{
        console.log(err)
    })
}

//update subCourse
export const updateSubCourse = (cid,sid,uid,token,video,sub) =>{
    console.log('Adminvideo:',video)
    let form = new FormData();
    if(sub){
        if(sub.name){
            console.log(sub.name)
            form.append('name',sub.name)
        }
        if(sub.description){
            console.log(sub.description)
            form.append('description',sub.description)
        }
    }
    if(video){
        for(let i=0;i<video.length;i++){
                form.append('videos',video[i]);
            }
    }
    return fetch(`${API}/sub/update/${cid}/${sid}/${uid}`,{
        method:'PUT',
        headers:{
            authorization:`Bearer ${token}`,
        },credentials:'include',
        body:form
    }).then(response=>{
        // console.log(response)
        return response.json();
    }).catch(err=>{
        console.log(err);
        // return err;
    })
}

//delete any video from SubCourse
export const deleteVideo = (cid,sid,uid,token,url)=>{
    console.log(JSON.stringify(url))
    return fetch(`${API}/sub/video/${cid}/${sid}/${uid}`,{
         method:'DELETE',
        headers:{
            Accept:'application/json',
            'content-type':'application/json',
            authorization:`Bearer ${token}`,
        },credentials:'include',
        body:JSON.stringify(url)
    }).then(response=>{
        return response.json()
    }).catch(err=>{
        console.log(err)
    })
}

export const deleteSubCourse = (cid,sid,uid,token)=>{
    return fetch(`${API}/sub/delete/${cid}/${sid}/${uid}`,{
        method:'DELETE',
        headers:{
            Accept:'application/json',
            'content-type':'application/json',
            authorization:`Bearer ${token}`,
        },credentials:'include',
    }).then(response=>{
        return response.json();
    }).catch(err=>{
        console.log(err);
    })

}

export const deleteSubFromCourse =(cid,sid,uid,token,sub)=>{
    return fetch(`${API}/course/sub/${cid}/${uid}`,{
        method:'DELETE',
        headers:{
            Accept:'application/json',
            'content-type':'application/json',
            authorization:`Bearer ${token}`,
        },credentials:'include',
        body:JSON.stringify(sub)
    }).then(response=>{
        return response.json();
    }).catch(err=>{
        console.log(err)
    })
}