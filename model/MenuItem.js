const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    name:{
        type: String,
        required: [true, "Please enter the item name!"],
    },
    category:{
        type: String,
        required: [true, "Please enter the item category!"],
    },
    price:{
        type: Number,
        required: [true, "Please enter the item price!"],
    },
    image:{
        type: String,
        required: [true, "Please enter the item image URL!"],
    },
},{timestamps:true});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
module.exports = MenuItem;