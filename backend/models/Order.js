const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product: { type: String, required: true },  
  name: { type: String },                     
  price: { type: Number },                    
  quantity: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  products: [productSchema],

  totalPrice: { type: Number, required: true },

  status: {
    type: String,
    enum: ["pending", "processed", "shipped", "delivered", "cancelled"],
    default: "pending"
  },

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
