import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import Workspace from "../models/workspace.model.js";
import { Types } from "mongoose";

export const CreateWorkSpace = async (req, res) => {
    try {
        const { name, description, _id } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "name required"
            });
        }

        let workspace;

        if (_id) {
            workspace = await Workspace.findByIdAndUpdate(
                _id,
                { name, description },
                { new: true }
            );
        } else {
            workspace = await Workspace.create({
                name,
                description
            });
        }

        return res.status(200).json({
            success: true,
            message: _id ? "Workspace updated" : "Workspace created"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const GetWorkspace = async (req, res) => {
    const query = req.query.q || '';
    const { search = '', limit, offset, sortBy = 'createdAt', sortOrder } = req.query;
    const parsedLimit = parseInt(limit) || 10;
    const parsedOffset = parseInt(offset) || 0;
    try {
        // const Getworkspace = await Workspace.find().sort({ createdAt: -1 }).limit(parsedLimit).skip(parsedOffset)
        const aggregation = await Workspace.aggregate([
            {
                $match: {
                   ...(search && {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
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

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const DeleteWorkspace = async (req, res) => {
    const { workspaceId } = req.params
    if (!workspaceId) {
        return res.status(400).json({
            success: false,
            message: 'workspaceId required'
        })
    }
    try {
        const deletWorkSpace = await Workspace.deleteOne({ _id: new Types.ObjectId(workspaceId) })
        return res.status(200).json({
            success: true,
            message: 'WorkSpace deleted'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};