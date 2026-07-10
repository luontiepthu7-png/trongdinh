import { z } from 'zod';

// Schema validate form Checkout theo yêu cầu 4.2:
// - Tên: bắt buộc
// - SĐT: phải là số, đủ 10 ký tự
// - Email: đúng định dạng
// - Địa chỉ: bắt buộc
export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập họ tên')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^\d{10}$/, 'Số điện thoại phải là số và đủ 10 chữ số'),
  email: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập email')
    .email('Email không đúng định dạng'),
  address: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập địa chỉ giao hàng')
    .min(5, 'Địa chỉ quá ngắn, vui lòng nhập đầy đủ'),
});
