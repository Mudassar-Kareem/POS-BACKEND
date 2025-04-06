const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../midleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const userModel = require("../model/User");

exports.isUser = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please login to continue",401))
    }
    const decoded = await jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = await userModel.findById(decoded.id);
    next();
})

exports.isAdmin = catchAsyncErrors(async(req,res,next)=>{
    if(req.user && req.user.role !== "admin"){
        return next(new ErrorHandler("You are not allowed to access this resource",403))
    }
    next()
})
