const Category = require('../models/category')

//to create a new category (only ADMIN)
exports.createCategory=(req,res)=>{
    try {
        const catgry = new Category(req.body);
        catgry.save((err,cat)=>{
            if(err){
                console.log(err)
                return res.status(400).json({
                    error:"UNABLE TO SAVE CATEGORY IN DB"
                })
            }
           res.json({cat})
        })
    } catch (error) {
        console.log(error)
    }
}


//getting all categories
exports.getAllCategry=(req,res)=>{
    Category.find().exec((err,categories)=>{
        if(err){
            return res.status(400).json({
                error:"NO CATEGORIES FOUNd"
            })
        }
        return res.json(categories)
    })
}


//updating the category
exports.updateCategory=(req,res)=>{
    const category = req.category;
    if(!category){
        return res.json({
            error:"no category"
        })
    }
    category.name = req.body.name;
    category.save((err,updatedCategory)=>{
        if(err){
            return res.status(400).json({
                eror:"unable to update category"
            })
        }
        res.json(updatedCategory)
    })
}

//deleting a aprticular category
exports.removeCategory=(req,res)=>{
    const category = req.category;
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@',category)
    if(!category){
        return res.status(400).json({
            error:"failed to delete this category or category empty"
        })
    }
    category.remove((err,category)=>{
        if (err){
            return res.status(400).json({
                error:"failed to delete this category"
            })
        }
        res.json({
            msg:"succesfully deleted ${category}"
        })
    })
}

//category id of any category
exports.getCategoryById=(req,res,next,id)=>{
    Category.findById(id).exec((err,cate)=>{
        if(err){
            console.log(err)
            return res.status(400).json({
                err:"category not found in db"
            })
        }
        req.category = cate
        next()
    })
}

//get a single category
exports.getCategory=(req,res)=>{
    res.json(req.category)
}