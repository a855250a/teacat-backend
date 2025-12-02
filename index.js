// ================================
// 1. 引入套件
// ================================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Models
const Admin = require("./models/Admin");
const User = require("./models/User");
const Product = require("./models/Product");

// ================================
// 2. 連線 MongoDB
// ================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================================
// 3. 建立 Express
// ================================
const app = express();
app.use(express.json());
app.use(cors());

// ================================
// 4. 建立後台帳號（多組皆可）
// ================================
app.post("/admin/create", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.json({ success: false, message: "缺少欄位" });

  const exist = await Admin.findOne({ username });
  if (exist)
    return res.json({ success: false, message: "此帳號已存在" });

  const hashed = await bcrypt.hash(password, 10);

  const newAdmin = new Admin({
    username,
    password: hashed,
  });

  await newAdmin.save();
  res.json({ success: true, message: "管理員建立成功" });
});

// ================================
// 5. 後台登入 API
// ================================
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin)
    return res.json({ success: false, message: "帳號或密碼錯誤" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch)
    return res.json({ success: false, message: "帳號或密碼錯誤" });

  const token = jwt.sign(
    { adminID: admin._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ success: true, message: "後台登入成功", token });
});

// ================================
// 6. 前台註冊
// ================================
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.json({ success: false, message: "缺少欄位" });

  const exist = await User.findOne({ email });
  if (exist)
    return res.json({ success: false, message: "Email 已被註冊" });

  const hashed = await bcrypt.hash(password, 10);

  await new User({ name, email, password: hashed }).save();

  res.json({ success: true, message: "註冊成功" });
});

// ================================
// 7. 前台登入
// ================================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.json({ success: false, message: "帳號或密碼錯誤" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.json({ success: false, message: "帳號或密碼錯誤" });

  const token = jwt.sign(
    { userID: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ success: true, message: "登入成功", token });
});

// ================================
// 8. 新增商品
// ================================
app.post("/products", async (req, res) => {
  const { name, price, category, img, description, stock } = req.body;

  if (!name || !price || !category || !img)
    return res.json({ success: false, message: "缺少欄位" });

  const product = new Product({
    name,
    price,
    category,
    img,
    description,
    stock: stock || 0,
  });

  await product.save();
  res.json({ success: true, message: "商品新增成功", product });
});

// ================================
// 9. 取得全部商品
// ================================
app.get("/products", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ success: true, products });
});

// 取得所有後台管理者
app.get("/admin/all", async (req, res) => {
    try {
        const admins = await Admin.find().select("-password"); // 不顯示密碼
        res.json({ success: true, admins });
    } catch (err) {
        res.json({ success: false, message: "取得管理者失敗" });
    }
});


// 刪除管理者
app.delete("/admin/delete/:id", async (req, res) => {
    const { id } = req.params;

    await Admin.findByIdAndDelete(id);
    res.json({ success: true, message: "管理者已刪除" });
});



// ================================
// 10. 啟動伺服器（最後一行）
// ================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Server running on PORT " + PORT)
);
