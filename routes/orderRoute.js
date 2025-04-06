const express = require('express');
const { createOrder, getAllOrders, changeOrderStatus } = require('../controller/Order');
const { isUser } = require('../midleware/auth');
const orderRoute = express.Router();

orderRoute.post("/create",isUser,createOrder);
orderRoute.get("/getAllOrder",isUser,getAllOrders);
orderRoute.put("/changeStatus/:id",isUser,changeOrderStatus);

module.exports = orderRoute;