const userModel = require('../model/User');
const catchAsyncErrors = require('../midleware/catchAsyncErrors');
const MenuItem = require('../model/MenuItem');
const ErrorHandler = require("../utils/ErrorHandler");

// create menu item
const createMenuItem = catchAsyncErrors(async (req,res,next)=>{
    try {

        const restaurantId = req.user.id;
        const restaurant = await userModel.findById(restaurantId);
        if(!restaurant){
            return next(new ErrorHandler("Restaurant not found",404))
        }
        const {name,category,price,image} = req.body;
        const menuItem = await MenuItem.create({
            name,
            category,
            price,
            image,
            restaurantId
        })
        res.status(201).json({
            success:true,
            menuItem,
            message:"Menu Item Created successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

// get all menu items
const getAllMenuItem = catchAsyncErrors(async (req,res,next)=>{
    try {
        const menuItems = await MenuItem.find({restaurantId: req.user.id}).sort({createdAt:-1});
        res.status(200).json({
            success:true,
            menuItems
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

// update menu item
const updateMenuItem = catchAsyncErrors(async(req,res,next)=>{
    try {
        const restaurantId = req.user.id;
        const {name,category,price,image} = req.body;
        const menuItem = await MenuItem.findById(req.params.id);
        if(!menuItem){
            return next(new ErrorHandler("Menu Item not found",404))
        }
        if(menuItem.restaurantId.toString() !== restaurantId){
            return next(new ErrorHandler("You are not authorized to update this menu item",403))
        }
        if(name) menuItem.name = name;
        if(category) menuItem.category = category;
        if(price) menuItem.price = price;
        if(image) menuItem.image = image;
        await menuItem.save();
        res.status(200).json({
            success:true,
            menuItem,
            message:"Menu Item updated successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

// delete menu item
const deleteMenuItem = catchAsyncErrors(async(req,res,next)=>{
    try {
        const restaurantId = req.user.id;
        const menuItem = await MenuItem.findById(req.params.id);
        if(!menuItem){
            return next(new ErrorHandler("Menu Item not found",404))
        }
        if(menuItem.restaurantId.toString() !== restaurantId){
            return next(new ErrorHandler("You are not authorized to delete this menu item",403))
        }
        await menuItem.deleteOne()
        res.status(200).json({
            success:true,
            message:"Menu Item deleted successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

module.exports ={createMenuItem,getAllMenuItem,updateMenuItem,deleteMenuItem}