import mongoose from "mongoose";

const workSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true, 
    },
    description:{
        type:String,
        required:false,
        default:''
    },
    projectID:[{
        type: mongoose.Types.ObjectId,
        ref:"Project"
    }]
},{timestamps:true})

const Workspace = mongoose.model("Workspace", workSchema)
export default Workspace