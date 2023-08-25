const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: { type: String },
      category: { type: String },
      price: { type: Number },
      quantity: { type: Number },
      image: { type: String },
      address: { type: Object },
    },
  ],
  address: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled", "Returned"],
    default: "Pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  ExpectedDeliveryDate: {
    type: Date,
  },
  deliveredDate: {
    type: Date,
  },
  returnEndDate: {
    type: Date,
  },
  couponName: {
    type: String,
    default: "NIL",
  },
});

module.exports = mongoose.model("Order", orderSchema);
