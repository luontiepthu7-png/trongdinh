import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, hasItem } = useWishlistStore();

  const isWishlisted = hasItem(product.id);
  const hasSale = product.salePrice != null;

  function handleAddToCart(e) {
    e.preventDefault();
    addItem(product, 1);
  }

  function handleToggleWishlist(e) {
    e.preventDefault();
    toggleItem(product);
  }

  return (
    <div className="product">
      <div className="product-thumb">
        <Link to={`/product/${product.id}`} className="image">
          <img src={product.images[0]} alt={product.name} className="primary-image" loading="lazy" />
          {product.images[1] && (
            <img src={product.images[1]} alt={product.name} className="image-hover" loading="lazy" />
          )}
        </Link>
        {hasSale && <span className="badge-sale">Sale</span>}
        <button 
          className={`add-to-wishlist hintT-left ${isWishlisted ? 'active' : ''}`} 
          onClick={handleToggleWishlist}
          data-hint="Add to wishlist"
          aria-label="Add to wishlist"
        >
          <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart`}></i>
        </button>
      </div>
      <div className="product-info">
        <h6 className="title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h6>
        <span className="price">
          {hasSale ? (
            <>
              <span className="old">${product.price.toFixed(2)}</span>
              <span className="new">${product.salePrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="new">${product.price.toFixed(2)}</span>
          )}
        </span>
        <div className="product-buttons">
          <Link to={`/product/${product.id}`} className="product-button hintT-top" data-hint="Quick View">
            <i className="fas fa-search"></i>
          </Link>
          <button 
            className="product-button hintT-top" 
            data-hint="Add to Cart" 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <i className="fas fa-shopping-cart"></i>
          </button>
          <button 
            className="product-button hintT-top" 
            data-hint="Toggle Wishlist" 
            onClick={handleToggleWishlist}
          >
            <i className="fas fa-random"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
