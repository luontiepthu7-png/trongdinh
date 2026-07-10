import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { checkoutSchema } from '../components/checkout/checkoutSchema';
import { useCartStore, getUnitPrice } from '../store/cartStore';
import { placeOrder } from '../services/api';
import Toast from '../components/common/Toast';

export default function Checkout() {
  useEffect(() => {
    document.title = 'Thanh toán - Learts Handmade';
  }, []);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
  });

  async function onSubmit(formData) {
    setIsSubmitting(true);
    try {
      await placeOrder({
        customer: formData,
        items,
        total: subtotal,
      });
      setToast({ type: 'success', message: 'Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Learts.' });
      clearCart();
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setToast({ type: 'error', message: 'Đặt hàng thất bại. Vui lòng thử lại.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0 && !toast) {
    return (
      <div className="container page-checkout-empty">
        <h1>Thanh toán</h1>
        <p>Giỏ hàng đang trống, không có gì để thanh toán.</p>
        <Link to="/shop" className="btn btn-primary">
          Quay lại Cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="container page-checkout">
      <h1 className="page-title">Thanh toán</h1>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <h2>Thông tin giao hàng</h2>

          <div className="form-group">
            <label htmlFor="fullName">Họ và tên</label>
            <input id="fullName" type="text" {...register('fullName')} />
            {errors.fullName && <span className="field-error">{errors.fullName.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input id="phone" type="tel" {...register('phone')} />
            {errors.phone && <span className="field-error">{errors.phone.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" {...register('email')} />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ giao hàng</label>
            <textarea id="address" rows="3" {...register('address')} />
            {errors.address && <span className="field-error">{errors.address.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
          </button>
        </form>

        <div className="order-summary">
          <h2>Đơn hàng của bạn</h2>
          <ul className="order-summary-list">
            {items.map((item) => {
              const unitPrice = getUnitPrice(item);
              return (
                <li key={item.id}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(unitPrice * item.quantity).toFixed(2)}</span>
                </li>
              );
            })}
          </ul>
          <div className="order-total-row">
            <span>Tổng cộng</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
