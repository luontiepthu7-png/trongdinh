import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useProductDetail from '../hooks/useProductDetail';
import { useCartStore } from '../store/cartStore';
import Loading from '../components/common/Loading';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { product, isLoading, error } = useProductDetail(productId);
  const addItem = useCartStore((s) => s.addItem);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
  }, [productId]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - Learts Handmade`;
    }
  }, [product]);

  if (isLoading) return <Loading label="Đang tải sản phẩm..." />;

  if (error || !product) {
    return (
      <div className="container page-error">
        <p>Không tìm thấy sản phẩm này.</p>
        <button className="btn btn-primary" onClick={() => navigate('/shop')}>
          Quay lại Cửa hàng
        </button>
      </div>
    );
  }

  const maxQty = product.stock;
  const hasSale = product.salePrice != null;

  function handleQtyChange(delta) {
    setQuantity((q) => Math.min(maxQty, Math.max(1, q + delta)));
  }

  function handleAddToCart() {
    if (product.stock <= 0) return;
    addItem(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className="container page-product-detail">
      <nav className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{product.name}</span>
      </nav>

      <div className="product-detail-grid">
        <div className="product-gallery">
          <div className="gallery-main">
            <img src={product.images[activeImage]} alt={product.name} />
          </div>
          <div className="gallery-thumbs">
            {product.images.map((img, idx) => (
              <button
                key={img}
                className={`thumb ${idx === activeImage ? 'active' : ''}`}
                onClick={() => setActiveImage(idx)}
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="rating-row">
            {'★'.repeat(Math.round(product.rating))}
            {'☆'.repeat(5 - Math.round(product.rating))}
            <span className="review-count">({product.reviewCount} đánh giá)</span>
          </div>

          <div className="price-row">
            {hasSale ? (
              <>
                <span className="price-old">${product.price.toFixed(2)}</span>
                <span className="price-new">${product.salePrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="price-new">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="product-description">{product.description}</p>

          <p className="stock-info">
            Tình trạng kho:{' '}
            {product.stock > 0 ? (
              <span className="in-stock">Còn {product.stock} sản phẩm</span>
            ) : (
              <span className="out-stock">Hết hàng</span>
            )}
          </p>

          <div className="qty-selector">
            <button onClick={() => handleQtyChange(-1)} disabled={quantity <= 1}>
              −
            </button>
            <input type="number" value={quantity} readOnly />
            <button onClick={() => handleQtyChange(1)} disabled={quantity >= maxQty}>
              +
            </button>
          </div>

          <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={product.stock <= 0}>
            {product.stock <= 0 ? 'Hết hàng' : justAdded ? 'Đã thêm ✓' : 'Thêm vào giỏ hàng'}
          </button>
        </div>
      </div>
    </div>
  );
}
