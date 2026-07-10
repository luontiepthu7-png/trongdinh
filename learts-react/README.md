# Learts SPA – React.js (Đề thi kết thúc mô đun – Lập trình Frontend cơ bản)

Chuyển đổi template tĩnh HTML/CSS "Learts" thành ứng dụng Single Page Application (SPA)
hoàn chỉnh bằng React.js, đáp ứng đầy đủ yêu cầu trong đề thi số 02.

## 1. Cài đặt & chạy dự án

Yêu cầu: Node.js >= 18.

```bash
cd learts-react
npm install
npm run dev
```

Mở trình duyệt tại địa chỉ hiển thị trong terminal (mặc định `http://localhost:5173`).

Build production:

```bash
npm run build
npm run preview
```

## 2. Công nghệ sử dụng

| Hạng mục            | Công nghệ                              |
| ------------------- | --------------------------------------- |
| Framework            | React 18 + Vite                        |
| Routing               | React Router v6 (dynamic route `/product/:productId`) |
| Quản lý state giỏ hàng | Zustand + middleware `persist` (đồng bộ localStorage) |
| Validate Form         | React Hook Form + Zod (`@hookform/resolvers`) |
| Gọi API               | Service layer riêng (`src/services/api.js`), hiện dùng mock data giả lập độ trễ mạng, dễ dàng thay bằng axios thật |

## 3. Cấu trúc thư mục

```
src/
  components/
    layout/       -> Header, Footer, MainLayout (chứa <Outlet/>)
    home/          -> HeroBanner, CategoryList, FeaturedProducts
    product/       -> ProductCard, ShopToolbar
    checkout/      -> checkoutSchema (Zod)
    common/        -> Loading, ProductCardSkeleton, Pagination, Toast
  pages/           -> Home, Shop, ProductDetail, Cart, Checkout, NotFound
  hooks/           -> useCategories, useFeaturedProducts, useProducts, useProductDetail
  store/           -> cartStore.js (Zustand)
  services/        -> api.js (service layer), mockData.js (dữ liệu giả lập)
  routes/          -> AppRoutes.jsx
```

## 4. Mapping yêu cầu đề bài -> nơi triển khai

- **1.1 Tách Component**: Header, Footer, ProductCard, HeroBanner trong `src/components`.
- **1.2 Hiển thị dữ liệu / Loading**: `useCategories`, `useFeaturedProducts` gọi "API" (mock,
  có độ trễ `delay()`), hiển thị `ProductCardSkeleton` / `Loading` khi đang tải.
- **2. Trang Shop**: `pages/Shop.jsx` + `useProducts` — Grid sản phẩm, lọc theo Category,
  sắp xếp theo giá (tăng/giảm), phân trang (`Pagination.jsx`). Trạng thái lọc/sort/trang được
  đồng bộ vào query string trên URL.
- **3. Product Detail**: Route động `/product/:productId` (React Router v6),
  `useProductDetail` fetch theo id, tăng/giảm số lượng không vượt tồn kho.
- **4.1 Giỏ hàng**: `store/cartStore.js` dùng Zustand, có `persist` để đồng bộ localStorage
  (F5 không mất giỏ hàng). Thêm/sửa số lượng/xóa sản phẩm, tính tổng tiền qua selector
  `getSubtotal()`.
- **4.2 Checkout**: `pages/Checkout.jsx` dùng React Hook Form + Zod
  (`components/checkout/checkoutSchema.js`) validate: họ tên bắt buộc, SĐT đúng 10 chữ số,
  email đúng định dạng, địa chỉ bắt buộc. Khi submit thành công: gọi `placeOrder()` (POST
  giả lập), hiện Toast, tự động xóa giỏ hàng (`clearCart()`) và điều hướng về trang chủ.

## 5. Kết nối Backend thật (khi có)

Trong `src/services/api.js`, đổi `USE_MOCK = false` và cấu hình `BASE_URL` + tạo axios
instance với interceptor (đã có sẵn đoạn code mẫu comment trong file) để quản lý caching/lỗi
tập trung. Toàn bộ phần còn lại của ứng dụng (hooks, components, pages) không cần sửa vì đã
tách biệt qua service layer.

## 6. Ghi chú

- Ảnh sản phẩm dùng `picsum.photos` làm ảnh minh họa (placeholder), có thể thay bằng ảnh thật
  của bạn trong `src/services/mockData.js`.
- Style lấy cảm hứng từ giao diện gốc Learts (tông màu kem, chữ serif, điểm nhấn màu đất nung)
  nhưng được viết lại hoàn toàn bằng CSS thuần trong `src/index.css`, không phụ thuộc CSS gốc
  của template.
