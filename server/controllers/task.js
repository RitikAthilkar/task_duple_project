import { Types } from "mongoose";
import Task from "../models/task.model.js";

export const CreateTask = async (req, res) => {
    try {
        const { task_id, task_name, task_description,  task_due_date,  task_priority, task_member, projectId } = req.body;
        if (!task_name || !task_description || !task_due_date || !task_member || !task_priority || !projectId ) {
            return res.status(400).json({
                success: false,
                message: 'required data missing'
            })
        }
         
       if(task_id){

           const updatetask = await Task.findByIdAndUpdate(task_id, {
               task_name, task_description, task_due_date, task_priority
           })

       }else{
           const createTask = await Task.create({
               task_name, task_description, task_due_date, task_priority, userId: new Types.ObjectId(task_member), projectId: new Types.ObjectId(projectId)
           })
       }

     
        return res.status(200).json({
            success: true,
            message: task_id ? 'Task updated successfully' : 'Task created successfully'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const GetUserTask = async (req, res) => {
    const { userId } = req.body

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'userId  required'
        })
    }
    try {
        const getTask = await Task.find({ userId: new Types.ObjectId(userId) })
        return res.status(200).json({
            success: true,
            data: getTask
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const GetProjectTask = async (req, res) => {
    const { projectId } = req.body

    if (!projectId) {
        return res.status(400).json({
            success: false,
            message: 'projectId  required'
        })
    }
    try {
        const getTask = await Task.find({ projectId: new Types.ObjectId(projectId) }).populate('userId').sort({ createdAt: -1 })
        return res.status(200).json({
            success: true,
            data: getTask
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const { taskId, status } = req.body;

        if (!taskId || !status) {
            return res.status(400).json({ success: false, message: "Task ID and status are required" });
        }

        if (!["todo", "inprocess", "completed"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const task = await Task.findByIdAndUpdate(
            taskId,
            { status },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.json({ success: true, data: task, message: "Task status updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const DeleteTask = async (req, res) => {
    const { taskId } = req.params
    if (!taskId) {
        return res.status(400).json({
            success: false,
            message: 'taskId required'
        })
    }
    try {

        const deletTask = await Task.deleteOne({ _id: new Types.ObjectId(taskId) })
        return res.status(200).json({
            success: true,
            message: 'Task deleted'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};