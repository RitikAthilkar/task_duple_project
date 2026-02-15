import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const isAuth = async (req, res, next) => {
    try {
        let token = await req.get('authorization');
        token = token.replace('Bearer ', '')
     
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
   
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log('error', error)
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};
