const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userID:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items:       [{
    name:  String,
    price: Number,
    qty:   Number,
    img:   String
  }],
  totalAmount: { type: Number, required: true },
  receiver:    { type: String, required: true },
  phone:       { type: String, required: true },
  address:     { type: String, required: true },
  status:      { type: String, default: "待處理" }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
