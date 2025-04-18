const catchAsyncErrors = require("../midleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const orderModel = require("../model/Order")

// create order
const createOrder = catchAsyncErrors(async (req,res,next)=>{
    try {
        const restaurantId = req.user.id;
        const { orderType, customerDetails, items, totalPrice,platforms } = req.body;
        const order = await orderModel.create({
            restaurantId,
            orderType,
            customerDetails,
            items,
            totalPrice,
            platforms
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
const getAllOrders = catchAsyncErrors(async (req, res, next) => {
    try {
      let orders = await orderModel.find({ restaurantId: req.user.id });
  
      orders.sort((a, b) => {
        const timeA = a.customerDetails?.ordertime
          ? new Date(`1970-01-01T${a.customerDetails.ordertime}:00`)
          : new Date(a.createdAt);
  
        const timeB = b.customerDetails?.ordertime
          ? new Date(`1970-01-01T${b.customerDetails.ordertime}:00`)
          : new Date(b.createdAt);
  
        return timeA - timeB;
      });
  
      res.status(200).json({
        success: true,
        orders,
        message: "Orders fetched successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
  
  
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