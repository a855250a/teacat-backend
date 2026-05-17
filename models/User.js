const mongoose = require("mongoose");


// 建立 User Schema（定義使用者資料格式）
const UserSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender:   { type: String, enum: ["male", "female"], required: true }
});

// module.exports → 把東西輸出
// mongoose.model("User", UserSchema)
// → 建立一個名字叫 "User" 的資料表
// → 使用你剛剛寫的 UserSchema

module.exports = mongoose.model("User", UserSchema);