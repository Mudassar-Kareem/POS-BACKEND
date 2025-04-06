const express = require("express");
const { createUser, userLogin, getAllUser, deleteUser, loadUser, updateUser, userLogout } = require("../controller/User");
const { isAdmin, isUser } = require("../midleware/auth");
const userRoute = express.Router();

userRoute.post("/create",createUser);
userRoute.post("/login",userLogin);
userRoute.get("/getUsers",isAdmin,getAllUser);
userRoute.get("/me",isUser,loadUser);
userRoute.get("/logout",userLogout)
userRoute.put("/updateUser",isUser,updateUser);
userRoute.delete("/deleteUser/:id",isAdmin,deleteUser);

module.exports = {userRoute}