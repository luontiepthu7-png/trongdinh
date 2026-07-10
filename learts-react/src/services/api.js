import axios from 'axios';
import { CATEGORIES, PRODUCTS, delay } from './mockData';

// ---------------------------------------------------------------------------
// LỚP SERVICE (Service Layer)
// Tách riêng logic gọi API khỏi component/hook, giúp dễ dàng thay thế
// mock data bằng axios/fetch thật khi có Backend chính thức.
// Nếu dùng Backend thật, chỉ cần sửa các hàm bên dưới, phần còn lại
// của ứng dụng (hooks, components) không cần thay đổi.
// ---------------------------------------------------------------------------

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'false' ? false : true;
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Cấu hình axios instance với interceptor (khi dùng API thật):
export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Thêm Auth token nếu có và xử lý request trước khi gửi
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Nhận dữ liệu chính (data) và xử lý lỗi toàn cục tập trung
http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const normalizedError = {
      message: error.response?.data?.message || error.message || 'Đã xảy ra lỗi hệ thống.',
      status: error.response?.status,
    };
    return Promise.reject(normalizedError);
  }
);

export async function getCategories() {
  if (USE_MOCK) {
    await delay(400);
    return CATEGORIES;
  }
  return http.get('/categories');
}

export async function getFeaturedProducts() {
  if (USE_MOCK) {
    await delay(500);
    return PRODUCTS.filter((p) => p.isFeatured);
  }
  return http.get('/products', { params: { featured: true } });
}

/**
 * Lấy danh sách sản phẩm có hỗ trợ lọc theo danh mục, sắp xếp theo giá và phân trang.
 * @param {Object} params
 * @param {string} [params.category] - id danh mục để lọc
 * @param {'asc'|'desc'} [params.sort] - sắp xếp theo giá tăng/giảm dần
 * @param {number} [params.page] - trang hiện tại (bắt đầu từ 1)
 * @param {number} [params.pageSize] - số sản phẩm mỗi trang
 */
export async function getProducts({ category, sort, page = 1, pageSize = 8, search, wishlist, wishlistIds = [] } = {}) {
  if (USE_MOCK) {
    await delay(600);
    let result = [...PRODUCTS];

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    if (search) {
      const query = search.toLowerCase().trim();
      result = result.filter((p) => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    if (wishlist) {
      result = result.filter((p) => wishlistIds.includes(p.id));
    }

    if (sort === 'asc') {
      result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    } else if (sort === 'desc') {
      result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    }

    const total = result.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const items = result.slice(start, start + pageSize);

    return { items, total, page, pageSize, totalPages };
  }
  return http.get('/products', { params: { category, sort, page, pageSize, search, wishlist } });
}

export async function getProductById(id) {
  if (USE_MOCK) {
    await delay(400);
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) {
      const error = new Error('Không tìm thấy sản phẩm');
      error.status = 404;
      throw error;
    }
    return product;
  }
  return http.get(`/products/${id}`);
}

/**
 * Gửi đơn hàng lên server (POST request giả lập).
 * @param {Object} orderPayload - { customer: {name, phone, email, address}, items, total }
 */
export async function placeOrder(orderPayload) {
  if (USE_MOCK) {
    await delay(800);
    return {
      success: true,
      orderId: `ORD-${Date.now()}`,
      ...orderPayload,
    };
  }
  return http.post('/orders', orderPayload);
}
