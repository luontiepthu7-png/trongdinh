import { Link } from 'react-router-dom';

export default function CategoryList() {
  return (
    <section className="section-padding category-banners-section" style={{ backgroundImage: "url('https://html-demo-orcin.vercel.app/premium/learts/assets/images/bg/home-2.webp')" }}>
      <div className="container">
        <div className="banners-grid">
          
          {/* About us box */}
          <div className="about-us-box">
            <div className="inner">
              <img 
                className="about-logo" 
                src="https://html-demo-orcin.vercel.app/premium/learts/assets/images/logo/logo-3.webp" 
                alt="Site Logo" 
              />
              <h2 className="title">Making & crafting</h2>
              <span className="special-title">Handicraft shop</span>
              <p>
                Crafting beautiful stuff with our own hands and the help from useful tools is a wonderful process, 
                where you can enjoy yourself while pulling out some ideas and busy perfecting your work.
              </p>
              <Link to="/shop" className="link-btn">Online Store</Link>
            </div>
          </div>

          {/* Toys Category */}
          <div className="category-banner2-wrap">
            <div className="category-banner2">
              <Link to="/shop?category=toys" className="inner">
                <div className="image-wrap">
                  <img src="https://html-demo-orcin.vercel.app/premium/learts/assets/images/banner/category/banner-s2-1.webp" alt="Toys" />
                </div>
                <div className="content">
                  <h3 className="title">
                    Toys <span className="number">6 items</span>
                  </h3>
                </div>
              </Link>
              <span className="banner-desc right">NEW COLLECTION</span>
            </div>
          </div>

          {/* Knitting & Sewing Category */}
          <div className="category-banner2-wrap">
            <div className="category-banner2">
              <Link to="/shop?category=knitting-sewing" className="inner">
                <div className="image-wrap">
                  <img src="https://html-demo-orcin.vercel.app/premium/learts/assets/images/banner/category/banner-s2-2.webp" alt="Knitting & Sewing" />
                </div>
                <div className="content">
                  <h3 className="title">
                    Knitting & Sewing <span className="number">4 items</span>
                  </h3>
                </div>
              </Link>
              <span className="banner-desc right">SALE UP TO 40%</span>
            </div>
          </div>

          {/* Gift Ideas Category */}
          <div className="category-banner2-wrap spacer-lg">
            <div className="category-banner2">
              <Link to="/shop?category=gift-ideas" className="inner">
                <div className="image-wrap">
                  <img src="https://html-demo-orcin.vercel.app/premium/learts/assets/images/banner/category/banner-s2-3.webp" alt="Gift ideas" />
                </div>
                <div className="content">
                  <h3 className="title">
                    Gift ideas <span className="number">16 items</span>
                  </h3>
                </div>
              </Link>
              <span className="banner-desc right">BEST SELLERS</span>
            </div>
          </div>

          {/* Home Decor Category */}
          <div className="category-banner2-wrap spacer-pt">
            <div className="category-banner2">
              <Link to="/shop?category=home-decor" className="inner">
                <div className="image-wrap">
                  <img src="https://html-demo-orcin.vercel.app/premium/learts/assets/images/banner/category/banner-s2-4.webp" alt="Home Decor" />
                </div>
                <div className="content">
                  <h3 className="title">
                    Home Decor <span className="number">16 items</span>
                  </h3>
                </div>
              </Link>
              <span className="banner-desc left">BEST SELLERS</span>
            </div>
          </div>

          {/* Spring Sale banner */}
          <div className="sale-banner3-wrap">
            <div className="sale-banner3">
              <span className="special-title">Spring sale</span>
              <h2 className="title" data-text="ss – 18">Sale up to 10% all</h2>
              <Link to="/shop" className="link-btn">ONLINE STORE</Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
