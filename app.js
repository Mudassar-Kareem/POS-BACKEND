require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./midleware/error");
const { userRoute } = require("./routes/userRoutes");
const { menuItemRoute } = require("./routes/menuItemRoute");
const orderRoute = require("./routes/orderRoute");

const app = express();
const corsOptions = {
    origin:["https://pos-psi-sable.vercel.app"], //"http://localhost:5173"
    optionsSuccessStatus: 200, 
    credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Testing API
app.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'API is working'
    });
});

// routes
app.use("/api/v1/user",userRoute)
app.use("/api/v1/menu",menuItemRoute)
app.use("/api/v1/order",orderRoute)

// Unknown route handler
app.all('*', (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});

// Error middleware
app.use(errorMiddleware);

module.exports = { app };
