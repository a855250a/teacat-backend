# 茶貓商店 TeaCat Shop — 後端

茶貓商店電商平台的後端 API，處理會員驗證、商品管理與訂單系統。

🔗 **API Base URL：** `https://teacat-backend-1.onrender.com`

---

## 技術棧

| 項目 | 說明 |
|------|------|
| Node.js + Express | Web 框架 |
| MongoDB Atlas | 雲端資料庫 |
| Mongoose | ODM，定義資料結構 |
| bcrypt | 密碼加密 |
| jsonwebtoken | JWT 會員驗證 |
| Render | 後端部署平台 |

## API 列表

### 會員

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | `/register` | 會員註冊 |
| POST | `/login` | 會員登入，回傳 JWT token |

### 商品

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/products` | 取得所有商品 |
| POST | `/products` | 新增商品 |

### 訂單（需登入）

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | `/orders` | 建立訂單 |
| GET | `/orders` | 取得我的所有訂單 |
| GET | `/orders/:id` | 取得單筆訂單明細 |

### 後台管理員

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | `/admin/login` | 管理員登入 |
| POST | `/admin/create` | 建立管理員帳號 |
| GET | `/admin/all` | 取得所有管理員 |
| DELETE | `/admin/delete/:id` | 刪除管理員 |

## 資料模型

- **User**：name、email、password（加密）、gender
- **Product**：name、price、category、img、description、stock
- **Order**：userID、items、totalAmount、receiver、phone、address、status
- **Admin**：username、password（加密）

## 前台專案

👉 [teacat-frontend](https://github.com/a855250a/teacat-frontend)
