# Hệ Thống RESTful API & Admin Dashboard - E-Commerce "Learts"

Chào mừng bạn đến với dự án backend cho nền tảng thương mại điện tử **Learts**. Đây là giải pháp hoàn chỉnh bao gồm hệ thống **RESTful API** và **Admin Dashboard** cao cấp được thiết kế theo đúng yêu cầu nghiệp vụ của bạn.

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
thi-backend/
├── public/                     # Giao diện tĩnh & Admin UI
│   └── admin/
│       ├── css/
│       │   └── style.css       # CSS thiết kế Premium (Glassmorphism, Earth tones)
│       ├── js/
│       │   └── auth.js         # Bảo vệ route UI & quản lý token
│       ├── login.html          # Trang Đăng nhập Admin
│       ├── register.html       # Trang Đăng ký Admin
│       ├── products.html       # Bảng quản lý sản phẩm (CRUD)
│       └── orders.html         # Bảng quản lý đơn hàng & Cập nhật trạng thái
├── src/                        # Mã nguồn Backend APIs
│   ├── config/
│   │   └── db.js               # Kết nối CSDL MongoDB (Mongoose)
│   ├── controllers/
│   │   ├── authController.js   # Logic xác thực đăng ký/đăng nhập
│   │   ├── categoryController.js # Logic xử lý Danh mục
│   │   ├── productController.js  # Logic xử lý Sản phẩm (CRUD, phân trang, lọc)
│   │   └── orderController.js    # Logic đặt hàng, trừ tồn kho & quản lý đơn
│   ├── middlewares/
│   │   └── auth.js             # Middleware bảo mật JWT
│   ├── models/
│   │   ├── Category.js         # Schema danh mục
│   │   ├── Product.js          # Schema sản phẩm
│   │   ├── Order.js            # Schema đơn hàng (thông tin khách, giá lúc mua)
│   │   └── User.js             # Schema tài khoản Admin (Mã hóa bcrypt)
│   ├── routes/
│   │   ├── authRoutes.js       # Định tuyến xác thực
│   │   ├── categoryRoutes.js   # Định tuyến danh mục
│   │   ├── productRoutes.js    # Định tuyến sản phẩm
│   │   └── orderRoutes.js      # Định tuyến đơn hàng
│   ├── app.js                  # Cấu hình Express app
│   └── server.js               # Khởi chạy server
├── .env                        # Biến môi trường (Port, Connection String, JWT secret)
├── package.json                # Dependencies & script dự án
└── README.md                   # Hướng dẫn sử dụng
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Dự Án

### Bước 1: Yêu cầu hệ thống
Hãy đảm bảo bạn đã cài đặt:
- **Node.js** (Phiên bản v18 trở lên được khuyến nghị)
- **MongoDB** (Hoặc dùng tài khoản **MongoDB Atlas** trực tuyến)

### Bước 2: Cấu hình biến môi trường
Mở file `.env` ở thư mục gốc và thay đổi các cấu hình phù hợp với môi trường của bạn:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/learts
JWT_SECRET=learts_super_secret_jwt_key_12345
```
> [!NOTE]
> Nếu bạn sử dụng MongoDB Atlas trực tuyến, hãy thay thế `MONGO_URI` bằng đường dẫn kết nối do Atlas cung cấp.

### Bước 3: Cài đặt Dependencies
Chạy lệnh sau tại thư mục gốc để tải các thư viện cần thiết:
```bash
npm install
```

### Bước 4: Khởi tạo Dữ liệu Mẫu (Seeding)
Hệ thống cung cấp sẵn script seeding để khởi tạo:
1. Một tài khoản quản trị viên mặc định: **Username: `admin` | Password: `admin123`**
2. Các danh mục sản phẩm chính gốc từ web Learts (Pots, Kitchen, Home Decor,...)
3. 9 sản phẩm chất lượng cao đi kèm mô tả, giá cả, ảnh minh họa gốc và số lượng tồn kho.
4. 1 đơn hàng mẫu đang ở trạng thái `Pending`.

Chạy lệnh seeding:
```bash
npm run seed
```

### Bước 5: Khởi chạy Máy chủ
Khởi động máy chủ ở chế độ phát triển (sử dụng Nodemon để tự động tải lại khi đổi code):
```bash
npm run dev
```

Server sẽ chạy tại địa chỉ: [http://localhost:5000](http://localhost:5000).

---

## 🖥️ Trải Nghiệm Giao Diện Quản Trị (Admin Dashboard)

Khi server đang chạy, hãy truy cập đường dẫn:
👉 **[http://localhost:5000/admin/login](http://localhost:5000/admin/login)**

### 🌟 Các Điểm Nổi Bật Về Giao Diện:
1. **Thiết kế Premium**: Tông màu đất ấm ấm đặc trưng của thương hiệu Learts, tích hợp hiệu ứng **Glassmorphism**, đổ bóng mịn màng và chuyển động chuyển cảnh mượt mà.
2. **Route Protection (Bảo mật)**: Nếu bạn chưa đăng nhập mà cố tình truy cập vào `/admin/products` hoặc `/admin/orders`, script bảo vệ sẽ lập tức đẩy bạn về trang đăng nhập `/admin/login`.
3. **Quản lý Sản phẩm (/admin/products)**:
   - Hiển thị sản phẩm dạng bảng trực quan kèm ảnh đại diện.
   - Trạng thái kho hàng thông minh: Tự động đổi màu cảnh báo (Đỏ khi hết hàng, Cam khi sắp hết hàng `< 5`, Xanh khi đủ hàng).
   - Thao tác Thêm / Sửa nhanh qua **Modal popup** mượt mà mà không bị tải lại trang.
   - Bộ lọc phân loại danh mục hoạt động theo thời gian thực (Real-time).
   - Phân trang khoa học.
   - Nút Xóa có hộp thoại xác nhận an toàn trước khi gửi yêu cầu `DELETE`.
4. **Quản lý Đơn hàng (/admin/orders)**:
   - Danh sách đơn hàng sắp xếp mới nhất lên đầu.
   - Tính toán doanh thu thực tế (Tổng doanh thu của các đơn hàng không bị `Cancelled`).
   - Cập nhật trạng thái thông qua **Dropdown selection** đổi màu theo trạng thái (Pending ➔ Processing ➔ Completed ➔ Cancelled) kèm theo **logic xử lý kho hàng**.
   - Hỗ trợ nút **View** để bật popup hóa đơn chi tiết từng món hàng, số lượng và thông tin người nhận.

---

## 🔌 Hệ Thống RESTful API (Tài Liệu Chi Tiết)

Mọi API phản hồi thống nhất theo định dạng: `{ success: true/false, message: "...", data: ... }`.

### 1. Module Quản trị & Xác thực (Authentication)
- **POST `/api/auth/register`**: Đăng ký tài khoản Admin mới.
  - *Payload*: `{ "username": "admin2", "email": "admin2@gmail.com", "password": "password123" }`
- **POST `/api/auth/login`**: Đăng nhập Admin và lấy token JWT.
  - *Payload*: `{ "username": "admin", "password": "admin123" }`
  - *Response*: Trả về token JWT và thông tin user.

### 2. Module Danh Mục (Category)
- **GET `/api/categories`**: Lấy toàn bộ danh sách danh mục (Phục vụ bộ lọc và form thêm/sửa sản phẩm).
- **POST `/api/categories`** *(Yêu cầu Bearer Token)*: Thêm danh mục mới.

### 3. Module Sản Phẩm (Product)
- **GET `/api/products`**: Lấy danh sách sản phẩm.
  - *Query Params*:
    - `page` (Mặc định: 1): Trang cần lấy.
    - `limit` (Mặc định: 10): Số sản phẩm mỗi trang.
    - `categoryId`: Lọc theo mã danh mục cụ thể.
- **GET `/api/products/:id`**: Xem chi tiết sản phẩm theo ID.
- **POST `/api/products`** *(Yêu cầu Bearer Token)*: Tạo sản phẩm mới.
  - *Payload*: `{ "name": "...", "description": "...", "price": 99.9, "imageUrl": "...", "stock": 10, "categoryId": "..." }`
- **PUT `/api/products/:id`** *(Yêu cầu Bearer Token)*: Cập nhật thông tin sản phẩm.
- **DELETE `/api/products/:id`** *(Yêu cầu Bearer Token)*: Xóa sản phẩm khỏi DB.

### 4. Module Đơn Hàng (Order Processing)
- **POST `/api/orders`**: Khách đặt hàng (Client).
  - *Payload*:
    ```json
    {
      "customerName": "Nguyen Van B",
      "customerPhone": "0912345678",
      "customerAddress": "456 Đường Nguyễn Trãi, Quận 5, TP. HCM",
      "items": [
        { "productId": "id_san_pham_1", "quantity": 2 },
        { "productId": "id_san_pham_2", "quantity": 1 }
      ]
    }
    ```
  - **Logic kho hàng cốt lõi**:
    - Hệ thống sẽ duyệt từng item để kiểm tra tồn kho.
    - Nếu bất kỳ sản phẩm nào có số lượng mua `quantity` lớn hơn số lượng tồn kho `stock` hiện tại trong DB, hệ thống sẽ **báo lỗi lập tức và không tạo đơn** (Transaction-safe).
    - Nếu hợp lệ, hệ thống sẽ tự động trừ đi số lượng tồn kho tương ứng của sản phẩm đó và tạo hóa đơn lưu trữ giá bán tại thời điểm mua hàng.
- **GET `/api/orders`** *(Yêu cầu Bearer Token)*: Lấy danh sách đơn hàng (mới nhất xếp trước).
- **PUT `/api/orders/:id/status`** *(Yêu cầu Bearer Token)*: Cập nhật trạng thái đơn hàng.
  - *Payload*: `{ "status": "Processing" }` (Chấp nhận các giá trị: `Pending`, `Processing`, `Completed`, `Cancelled`).
  - **Logic kho hàng nâng cao**: Khi đổi sang `Cancelled`, hệ thống tự động cộng trả lại số lượng tồn kho cho các sản phẩm trong đơn hàng đó. Nếu chuyển lại từ `Cancelled` sang trạng thái khác, hệ thống sẽ kiểm tra tồn kho và trừ lại.

---

## 🔒 Kiểm Tra Middleware & Bảo Mật Route
1. Mở Postman hoặc cURL, gửi yêu cầu `POST /api/products` mà không đính kèm header `Authorization: Bearer <Token>`. Bạn sẽ nhận được mã phản hồi `401 Unauthorized` cùng thông báo từ chối truy cập.
2. Đăng nhập qua `/api/auth/login` để lấy token, sau đó cấu hình Header Authorization trong Postman: `Bearer <token_cua_ban>` để thực hiện thành công các thao tác quản trị.
