import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import Project from "../models/project.model.js";
import { Types } from "mongoose";

export const CreateProject = async (req, res) => {
    try {
        const { name, description, workspaceId, due_date, members, remark, _id,  } = req.body;
        if (!name || !workspaceId || !description || !due_date) {
            return res.status(400).json({
                success: false,
                message: 'name, description & due_date are required'
            })
        }
       if(_id){
           const orgproject = await Project.findById(_id);

           const oldMembers = orgproject.members.map(i => i.toString());
           const newMembers = members.map(i => i.toString());

           const addedMembers = newMembers.filter(
               id => !oldMembers.includes(id)
           );

           const removedMembers = oldMembers.filter(
               id => !newMembers.includes(id)
           );

           const updateProject = await Project.findByIdAndUpdate(
               _id,
               {
                   name,
                   description,
                   workspaceId,
                   due_date,
                   members,
                   remark
               },
               { new: true }
           );

           if (addedMembers.length > 0) {
               await User.updateMany(
                   { _id: { $in: addedMembers } },
                   { $set: { status: "assigned" } }
               );
           }

           if (removedMembers.length > 0) {
               await User.updateMany(
                   { _id: { $in: removedMembers } },
                   { $set: { status: "available" } }
               );
           }

   
       }else{
           const createproject = await Project.create({
               name, description, workspaceId, due_date, members, remark
           })
           console.log(createproject.status);
           if (members) {
               const UpdateMember = await User.updateMany({ _id: { $in: members } }, { $set: { status: 'assigned' } })
           }

       }

        return res.status(200).json({
            success: true,
            message: _id ? 'Project updated successfully' : 'Project created successfully'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const GetProject = async (req, res) => {
    const { workspaceId } = req.body
    const {search=" ",limit, offset, sortBy = 'createdAt', sortOrder} = req.query
    const parsedLimit = parseInt(limit) || 10;
    const parsedOffset = parseInt(offset) || 0;
    const parsedSortOrder = parseInt(sortOrder) || -1;
    if (!workspaceId) {
        return res.status(400).json({
            success: false,
            message: 'workspaceId  required'
        })
    }
    try {
        const aggregation = await Project.aggregate([
            {
                $match: {
                       workspaceId: new Types.ObjectId(workspaceId),
                    ...(search && {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { status: { $regex: search, $options: 'i' } },
                        ]
                    })
                }
            },
            {
                $facet: {
                    data: [
                        {
                            $sort: {
                                [sortBy || 'createdAt']: Number(sortOrder) || -1
                            }
                        }
                        ,
                        { $skip: parsedOffset },
                        { $limit: parsedLimit }
                    ],
                    totalCount: [
                        { $count: 'count' }
                    ]
                }
            }
        ]);
        return res.status(200).json({
            success: true,
            data: {
                list: aggregation[0].data,
                paggination: {
                    hasMore: parsedOffset + parsedLimit < (aggregation[0].totalCount[0] ? aggregation[0].totalCount[0].count : 0),
                    totalCount: aggregation[0].totalCount[0] ? aggregation[0].totalCount[0].count : 0
                }
            },
        })
        return res.status(200).json({
            success: true,
            data: Getproject
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const GetProjectDetail = async (req, res) => {
    const { projectId } = req.body
    if (!projectId) {
        return res.status(400).json({
            success: false,
            message: 'projectId  required'
        })
    }
    try {
        const Getproject = await Project.findOne({ _id: new Types.ObjectId(projectId) }).populate('workspaceId').populate('members').sort({ createdAt: -1 })
        return res.status(200).json({
            success: true,
            data: Getproject
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const AssignMember = async (req, res) => {
    const { projectId,members } = req.body
    if (!projectId || !members) {
        return res.status(400).json({
            success: false,
            message: 'projectId and Member  required'
        })
    }

    try {
        const updateprojectmember = await Project.updateMany({ _id: new Types.ObjectId(projectId.id) },{$set:{members:members}})

        if(updateprojectmember){
            const UpdateMemberstatus = await User.updateMany({ _id: { $in: members } }, { $set: { status: 'assigned' } })
            const updateProjectStatus = await Project.findByIdAndUpdate({ _id: projectId.id }, { $set: { project_status: 'inprocess' } })
        }
        return res.status(200).json({
            success: true,
            message: 'Member assigned to project'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const RemoveMember = async (req, res) => {
    const { projectId,members } = req.body
    if (!projectId || !members) {
        return res.status(400).json({
            success: false,
            message: 'projectId and Member  required'
        })
    }

    try {
        const updateprojectmember = await Project.findByIdAndUpdate(
            projectId,
            {
                $pull: {
                    members: { $in: members }
                }
            },
            { new: true }
        );

        const project = await Project.findById(projectId);
        if (project.members.length === 0) {
            await Project.findByIdAndUpdate(
                projectId,
                { $set: { status: "pending" } }
            );
        }
        if(updateprojectmember.members.length === 0){
            const updateProjectStatus = await Project.findByIdAndUpdate({ _id: new Types.ObjectId(projectId) }, { $set: { project_status: 'pending' } })
        }
        if(updateprojectmember){
            const UpdateMemberstatus = await User.updateMany({ _id: { $in: members } }, { $set: { status: 'available' } })
        }


        return res.status(200).json({
            success: true,
            message: 'Member removed from project'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const DeleteProject = async (req, res) => {
    const { projectId } = req.params
    if (!projectId ) {
        return res.status(400).json({
            success: false,
            message: 'projectId required'
        })
    }
    try {
        
        const project = await Project.findOne({ _id: new Types.ObjectId(projectId) })
        if (project.members){
            const UpdateMemberstatus = await User.updateMany({ _id: { $in: project.members } }, { $set: { status: 'available' } })
        }
        const deletProject = await Project.deleteOne({ _id: new Types.ObjectId(projectId) })
        return res.status(200).json({
            success: true,
            message:'Project deleted'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


