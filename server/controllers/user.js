import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { Types } from "mongoose";
import Project from "../models/project.model.js";

export const Register = async (req, res) => {
    try {
        const { name, employee_id, email, password, role } = req.body;

        if (!name || !employee_id || !email || !password) {
            return res.status(200).json({
                success: false,
                message: "All fields required"
            });
        }

        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(200).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashpass = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            role,
            name,
            employee_id,
            email,
            password: hashpass
        });

        return res.status(201).json({
            success: true,
            message: "Registered Successfully",
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const Login = async (req, res) => {
    try {

        const { employee_id, email, password } = req.body

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'password required'
            })
        }

        const user = await User.findOne({ $or: [{ email }, { employee_id }] })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found'
            })
        }
        const passVerify = await bcrypt.compare(
            password,
            user.password
        );

        if (!passVerify) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            user: {
                token,
                _id: user._id,
                role: user.role,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error)
    }
}
export const FetchUser = async (req, res) => {
    try {

        const { status } = req.body

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'status required'
            })
        }

        const user = await User.find({ $and: [{ status }, { role: 'user' }] })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'fetched user data',
            data: user
        });

    } catch (error) {
        console.log(error)
    }
}
export const FetchUserDetails = async (req, res) => {
    try {

        const { id } = req.body

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'userId required '
            })
        }

        const user = await User.findOne({ $and: [{ _id: new Types.ObjectId(id) }, { role: 'user' }] })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'fetched user data',
            data: user
        });

    } catch (error) {
        console.log(error)
    }
}

export const FetchProjectMember = async (req, res) => {
    const { members } = req.body
    if (!members) {
        return res.status(400).json({
            success: false,
            message: 'members Id required'
        })
    }
    try {
        const Getmembers = await User.find({ _id: { $in: members } })
        return res.status(200).json({
            success: true,
            data: Getmembers
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const GetUserProject = async (req, res) => {
    const { userId } = req.body

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'userId  required'
        })
    }
    try {
        const getProject = await Project.findOne({ members: { $in: new Types.ObjectId(userId) } }).populate('workspaceId').sort({ createdAt: -1 })
        return res.status(200).json({
            success: true,
            data: getProject
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
