import userModel from "../models/user.model.js"
import { getToken } from "../config/token.js";

export const googleAuth = async (req, res) => {
    try {
        const {name, email} = req.body;
        let user = await userModel.findOne({email});
        if(!user){
            user = await userModel.create({
                name, email
            })
        }
        let token = await getToken(user._id);
        res.cookie("token", token, {
            httpOnly:true,
            secure:true,
            sameSite:"none", 
            maxAge:7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(user);
    } catch (error){
        return res.status(500).json({message:`googleSignup Error ${error}`});
    }
}

export const logOut = (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(500).json({
            message: `Logout Error ${error.message}`
        });
    }
}