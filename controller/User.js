const userModel = require("../model/User");
const catchAsyncErrors = require("../midleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/sendToken");

// create user
const createUser = catchAsyncErrors(async (req,res,next)=>{
    try {
        const {restaurantName,address,type,contactNo,email,name,password,subscriptionType} = req.body;
        const isEmailExist = await userModel.findOne({email});
        if(isEmailExist){
            return next(new ErrorHandler("Email already exist",400))
        }
        const user = await userModel.create({
            restaurantName,address,type,contactNo,email,name,password,subscriptionType
        })
        if(subscriptionType === "yearly"){
            user.pkgExpiry = Date.now() + 365 * 24 * 60 * 60 * 1000;
        }
        await user.save();
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
        if(user.status === "Deactive"){
            return next(new ErrorHandler("Sorry you can't login, your account is deactivated by admin",400))
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

// update user status --Admin
const updateStatus = catchAsyncErrors(async(req,res,next)=>{
    try {
        const user = await userModel.findById(req.params.id);
        if(!user){
            return next(new ErrorHandler("User not found",404))
        }
        if(user.status === "Active"){
            user.status = "Deactive"
        }else{
            user.status = "Active"
        }
        await user.save();
        res.status(200).json({
            success:true,
            message:"User status updated successfully"
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

// user logout
const userLogout = catchAsyncErrors(async(req,res,next)=>{
    try {
        res.cookie("token",null,{
            expires:new Date(Date.now()),
            httpOnly:true,
        })
        res.status(200).json({
            success:true,
            message:"User logout successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})


module.exports = {createUser,userLogin,getAllUser,loadUser,updateUser,userLogout,updateStatus}