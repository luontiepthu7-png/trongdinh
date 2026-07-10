import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useState } from 'react';

export default function Header() {
  const totalItems = useCartStore((s) => s.getTotalItems());
  const wishlistItems = useWishlistStore((s) => s.items.length);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <header className="site-header-custom bg-white">
      <div className="container header-container">
        <div className="row-wrapper">
          {/* Header Logo */}
          <div className="header-logo">
            <Link to="/">
              <img 
                src="https://html-demo-orcin.vercel.app/premium/learts/assets/images/logo/logo-2.webp" 
                alt="Learts Logo" 
                className="logo-img" 
              />
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="site-main-menu">
            <ul>
              <li>
                <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/shop" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Shop
                </NavLink>
              </li>
              <li className="has-children">
                <a href="#" onClick={(e) => e.preventDefault()}>Project</a>
                <ul className="sub-menu">
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Portfolio 3 Columns</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Portfolio 4 Columns</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Portfolio Details</a></li>
                </ul>
              </li>
              <li className="has-children">
                <a href="#" onClick={(e) => e.preventDefault()}>Elements</a>
                <ul className="sub-menu">
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Product Styles</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Category Banner</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Instagram</a></li>
                </ul>
              </li>
              <li className="has-children">
                <a href="#" onClick={(e) => e.preventDefault()}>Blog</a>
                <ul className="sub-menu">
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Standard Layout</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Grid Layout</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Single Post</a></li>
                </ul>
              </li>
              <li className="has-children">
                <a href="#" onClick={(e) => e.preventDefault()}>Pages</a>
                <ul className="sub-menu">
                  <li><Link to="/cart">Shopping Cart</Link></li>
                  <li><Link to="/checkout">Checkout</Link></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>About us</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Contact us</a></li>
                </ul>
              </li>
            </ul>
          </nav>

          {/* Search Box */}
          <div className="header2-search">
            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>

          {/* Header Tools */}
          <div className="header-tools">
            <div className="header-login">
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="Tài khoản">
                <i className="far fa-user"></i>
              </a>
            </div>
            <div className="header-wishlist">
              <Link to="/shop?wishlist=true" className="offcanvas-toggle" aria-label="Yêu thích">
                <span className="wishlist-count">{wishlistItems}</span>
                <i className="far fa-heart"></i>
              </Link>
            </div>
            <div className="header-cart">
              <Link to="/cart" className="offcanvas-toggle" aria-label="Giỏ hàng">
                <span className="cart-count">{totalItems}</span>
                <i className="fas fa-shopping-cart"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
