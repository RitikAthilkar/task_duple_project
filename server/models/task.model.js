import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

    projectId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User"
    },
    task_name:{
        type:String,
        required:true
    },
    task_description:{
        type:String,
        required:true
    },
    task_due_date:{
        type:Date,
        required:true
    },
    task_priority:{
        type:String,
        required:true
    },
    
    status:{
        type:String,
        enum:['todo', 'inprocess', 'completed'],
        default:'todo'
    }
},{timestamps:true})

const Task = mongoose.model("Task", taskSchema)
export default Task