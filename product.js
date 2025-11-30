const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },               // 商品名稱
    price: { type: Number, required: true },              // 價格
    category: {
      type: String,
      enum: ["飼料", "玩具", "貓砂", "貓抓板", "清潔用品", "保健食品"], // 固定這幾種
      required: true
    },
    img: { type: String, required: true },                // 圖片網址（之後用 Cloudinary 產生）
    description: { type: String },                        // 商品描述（可選）
    stock: { type: Number, default: 0 }                   // 庫存
  },
  { timestamps: true } // 自動加 createdAt / updatedAt
);

module.exports = mongoose.model("Product", productSchema);
