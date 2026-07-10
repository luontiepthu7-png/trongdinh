import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, getUnitPrice } from '../store/cartStore';

export default function Cart() {
  useEffect(() => {
    document.title = 'Giỏ hàng - Learts Handmade';
  }, []);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container page-cart-empty">
        <h1>Giỏ hàng của bạn</h1>
        <p>Giỏ hàng đang trống.</p>
        <Link to="/shop" className="btn btn-primary">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container page-cart">
      <h1 className="page-title">Giỏ hàng của bạn</h1>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const unitPrice = getUnitPrice(item);
            return (
              <tr key={item.id}>
                <td className="cart-product-cell">
                  <img src={item.image} alt={item.name} />
                  <span>{item.name}</span>
                </td>
                <td>${unitPrice.toFixed(2)}</td>
                <td>
                  <div className="qty-selector small">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <input type="number" value={item.quantity} readOnly />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>${(unitPrice * item.quantity).toFixed(2)}</td>
                <td>
                  <button className="remove-btn" onClick={() => removeItem(item.id)} aria-label="Xóa sản phẩm">
                    ×
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="cart-summary">
        <div className="cart-subtotal-row">
          <span>Tổng cộng:</span>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>
        <div className="cart-actions">
          <Link to="/shop" className="btn btn-outline">
            Tiếp tục mua sắm
          </Link>
          <button className="btn btn-primary" onClick={() => navigate('/checkout')}>
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
