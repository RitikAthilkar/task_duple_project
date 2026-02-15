import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    role:{
        type:String,
        default:"user" 
    },
    name:{
        type:String,
        required:true, 
    },
    employee_id:{
        type:String,
        required:true, 
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type: String,
        required: true,
    },
    status:{
        type:String,
        enum:['assigned', 'available'],
        default:'available'
    }
},{timestamps:true})

const User = mongoose.model("User",userSchema)
export default User