// 1. 引入套件
const express = require("express"); //讓你建立後端伺服器
const mongoose = require("mongoose"); //連接 MongoDB
const cors = require("cors"); //讓前端能打 API
const bcrypt = require("bcrypt"); //密碼加密
const jwt = require("jsonwebtoken") //登入後發 token

const User = require("./models/User"); //建立的 User model（要匯入）

// 2. 連線到 MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connetced"))
    .catch((err) => console.log(err));

const app = express();
app.use(express.json());
app.use(cors());

// 3. 註冊 API
app.post("/register", async (req, res) =>{
    const{ name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message:"缺少欄位"});
    }
    const existingUser = await User.findOne({ email});
// 檢查 email 是否已存在
    if (existingUser) {
        return res.json({ success: false, message: "Email 已被註冊"});
    }
// 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);
// 建立新使用者
    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });
// 存進資料庫
    await newUser.save()

    return res.json({ success:true, message: "註冊成功"});
});

app.post("/login", async (req, res) => {
    const{ email, password} = req.body;

    // 檢查欄位
    if (!email || !password) {
        return res.json({ success: false, message: "缺少欄位"});
    }

    // 找尋用戶
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ success: false, message: "帳號或密碼錯誤"});
    }

    // 比對密碼
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.json({ success: false, message: "帳號或密碼錯誤"});
    }

    // 產生 JWT Token
    const token = jwt.sign(
        { userID: user._id},
        process.env.JWT_SECRET //"TEA_CAT_SHOP_SECRET",
        { expiresIn: "7d" }
    );

    return res.json({
        success: true,
        message: "登入成功",
        token
    });
});

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token){
        return res.json({ success: false,message:" 未提供 Token"});
    }

    try {
        const decoded = jwt.verify(token, "process.env.JWT_SECRET");//"TEA_CAT_SHOP_SECRET");
        req.user = decoded;  // 把 userId 放入 req.user
        next();
    } catch (err) {
        return res.json({ success: false, message: "Token 無效，請重新登入"});    
    }
}

app.listen(3000, "0.0.0.0", () => console.log("Server running"));


//如本地端綁定在開啟
// app.listen(3000, () => {
//     console.log("Server running on port 3000");
// });


// app.get("/profile", verifyToken, async (req, res) => {
//     const user = await User.findById(req.user.userId);
//     res.json({ success: true, user });
// });