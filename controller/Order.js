const catchAsyncErrors = require("../midleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const orderModel = require("../model/Order")

// create order
const createOrder = catchAsyncErrors(async (req,res,next)=>{
    try {
        const restaurantId = req.user.id;
        const {customer,phone,orderType,dateTime,paymentMethod,items,address,totalPrice} = req.body;
        const order = await orderModel.create({
            restaurantId,
            customer,
            phone,
            orderType,
            dateTime,
            paymentMethod,
            address:orderType === "Delivery" ? address : "",
            items,
            totalPrice
        })
       
        res.status(201).json({
            success:true,
            order,
            message:"Order Created successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

// get all orders
const getAllOrders = catchAsyncErrors(async (req,res,next)=>{
    try {
        const orders = await orderModel.find({restaurantId:req.user.id})
        res.status(200).json({
            success:true,
            orders,
            message:"Orders fetched successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

// change order status
const changeOrderStatus = catchAsyncErrors(async (req,res,next)=>{
    try {
        const order = await orderModel.findById(req.params.id)
        if(!order){
            return next(new ErrorHandler("Order not found",404))
        }
        if(order.status === "Pending"){
            order.status = "Ready"
        }else if(order.status === "Ready"){
            return next(new ErrorHandler("Order already ready",400))
        }
        await order.save()
        res.status(200).json({
            success:true,
            order,
            message:"Order status updated successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})


module.exports = {createOrder,getAllOrders,changeOrderStatus};