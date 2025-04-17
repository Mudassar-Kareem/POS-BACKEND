const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderType: {
      type: String,
      enum: ["dine-in", "takeaway", "delivery"],
      required: true,
    },
    customerDetails: {
      name: { type: String, required: true },
      phone: String,
      address: String,
      ordertime: String,
      paymentMethod: {
        type: String,
        enum: ["cash", "card", "online"],
      },
    },
    items: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalPrice: Number,
    status: {
      type: String,
      enum: ["Pending", "Ready"],
      default: "Pending",
    },
    platforms:{
      type:String,
      default:"IRIS POS"
    },
  },
  
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
