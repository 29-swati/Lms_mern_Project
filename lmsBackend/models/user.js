const mongoose = require("mongoose")
const bycrypt = require("bcryptjs")
const _id = '5d273f9ed58f5e7093b549b0';
const userSchema = new mongoose.Schema(
    // { _id: mongoose.ObjectId }, { versionKey: false },
    {
    name:{
        type:String,
        // required:true,
        trim:true,
        maxlength:32
    },
    lastname:{
        type:String,
        // required:true,
        trim:true,
        maxlength:32,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        default:0,
    },
    coursesPurchase:{
        type:Array,
        default:[]
    },
    photoUrl:{
        type:String
    }
},{timestamps:true});

//middleware definition
userSchema.pre('save',async function(next){
    if(this.isModified("password")){
    this.password = await bycrypt.hash(this.password,10)
    this.confirmPassword=undefined
    }
    next();
})

const Model = mongoose.model("User",userSchema);
// async function myfun(){
//     await Model.create({ _id: new mongoose.Types.ObjectId(_id) });
// }

// myfun();
module.exports= Model