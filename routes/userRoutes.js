const express = require("express");
const { createUser, userLogin, getAllUser, deleteUser, loadUser, updateUser, userLogout, updateStatus } = require("../controller/User");
const { isAdmin, isUser } = require("../midleware/auth");
const userRoute = express.Router();

userRoute.post("/create",createUser);
userRoute.post("/login",userLogin);
userRoute.get("/getUsers",isUser,isAdmin,getAllUser);
userRoute.get("/me",isUser,loadUser);
userRoute.get("/logout",userLogout)
userRoute.put("/updateUser",isUser,updateUser);
userRoute.put("/updateStatus/:id",isUser,isAdmin,updateStatus)

module.exports = {userRoute}