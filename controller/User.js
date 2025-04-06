const userModel = require("../model/User");
const catchAsyncErrors = require("../midleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/sendToken");

// create user
const createUser = catchAsyncErrors(async (req,res,next)=>{
    try {
        const {name,restaurantName,email,password} = req.body;
        const isEmailExist = await userModel.findOne({email});
        if(isEmailExist){
            return next(new ErrorHandler("Email already exist",400))
        }
        const user = await userModel.create({
            name,
            restaurantName,
            email,
            password
        })
        //send token and save to cookies
        sendToken(user,201,res,"User Created successfully")
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

// login user
const userLogin = catchAsyncErrors(async(req,res,next)=>{
    try {
        const {email,password}  = req.body;
        const user = await userModel.findOne({email}).select("+password");
        if(!user){
            return next(new ErrorHandler("Please provide the correct information",400))
        }
        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid){
            return next(new ErrorHandler("Wrong Email or Password",400))
        }
        //send token and save to cookies
        sendToken(user,200,res,"User Login successfully")
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

// remeber user 
const loadUser = catchAsyncErrors(async (req,res,next)=>{
    try {
        const user = await userModel.findById(req.user.id);
        if(!user){
            return next(new ErrorHandler("User not found",404))
        }
        res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

// get All user --Admin
const getAllUser = catchAsyncErrors(async (req,res,next)=>{
    try {
        const users = await userModel.find({role : "user"}).sort({createdAt:-1});
        res.status(200).json({
            success:true,
            users
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

// delete user --Admin
const deleteUser = catchAsyncErrors(async(req,res,next)=>{
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);
        if(!user){
            return next(new ErrorHandler("User not found",404))
        }
        res.status(200).json({
            success:true,
            message:"User deleted successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

// update user info
const updateUser = catchAsyncErrors(async(req,res,next)=>{
    try {
        const {name,restaurantName,email} = req.body;
        const user = await userModel.findOne({email})
        if(!user){
            return next(new ErrorHandler("User not found",404))
        }
        if(name) user.name = name;
        if(restaurantName) user.restaurantName = restaurantName;
        await user.save();
        res.status(200).json({
            success:true,
            message:"User profile updated successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

module.exports = {createUser,userLogin,getAllUser,loadUser,deleteUser,updateUser}