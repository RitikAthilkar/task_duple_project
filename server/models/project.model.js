import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true, 
    },
    description:{
        type:String,
        required:false,
        default:''
    },
    workspaceId: {
        type: mongoose.Types.ObjectId,
        required:true,
        ref: "Workspace"
    },
    members:[ {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    remark: {
        type: String,
        default: ""
    },
    due_date: {
        type: Date,
        required:true,
    },
    project_status: {
        type: String,
        enum: ['pending', 'inprocess', 'completed'],
        default: 'pending'
    }
},{timestamps:true})

const Project = mongoose.model("Project", projectSchema)
export default Project