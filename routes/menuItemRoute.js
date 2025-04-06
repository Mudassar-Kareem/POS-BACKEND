const express = require('express');
const { isUser } = require('../midleware/auth');
const { createMenuItem, getAllMenuItem, updateMenuItem, deleteMenuItem } = require('../controller/MenuItem');
const menuItemRoute = express.Router();

menuItemRoute.post("/createItem",isUser,createMenuItem)
menuItemRoute.get("/getAllItems",isUser,getAllMenuItem)
menuItemRoute.put("/updateItem/:id",isUser,updateMenuItem)
menuItemRoute.delete("/deleteItem/:id",isUser,deleteMenuItem)

module.exports = {menuItemRoute}