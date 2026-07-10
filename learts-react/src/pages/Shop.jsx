import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import useCategories from '../hooks/useCategories';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/common/ProductCardSkeleton';
import Pagination from '../components/common/Pagination';

export default function Shop() {
  const {
    products,
    total,
    totalPages,
    page,
    category,
    sort,
    search,
    wishlist,
    isLoading,
    error,
    setCategory,
    setSort,
    setPage,
  } = useProducts();

  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  // Shop Layout/Filter State
  const [columns, setColumns] = useState(5); // default 5 columns matching demo!
  const [activeTab, setActiveTab] = useState('all'); // all, featured, new, sales
  const [priceRange, setPriceRange] = useState('all'); // all, 0-40, 40-80, 80-120, 120
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    let titleText = 'Shop';
    if (wishlist) {
      titleText = 'Wishlist';
    } else if (search) {
      titleText = `Search: ${search}`;
    } else if (category) {
      const catObj = categories.find((c) => c.id === category);
      titleText = catObj ? catObj.name : category.replace(/-/g, ' ');
    }
    document.title = `${titleText} – Learts Handmade`;
  }, [category, search, wishlist, categories]);

  // Handle in-memory filtering for tabs and price ranges on top of fetched page products
  let displayProducts = [...products];

  // Tab Filtering (Hot, New, Sale)
  if (activeTab === 'featured') {
    displayProducts = displayProducts.filter((p) => p.isFeatured);
  } else if (activeTab === 'new') {
    displayProducts = displayProducts.filter((p) => p.rating >= 4.0); // mock rating >= 4.0 as new/hot
  } else if (activeTab === 'sales') {
    displayProducts = displayProducts.filter((p) => p.salePrice !== null);
  }

  // Price range filtering
  if (priceRange !== 'all') {
    if (priceRange === '120+') {
      displayProducts = displayProducts.filter((p) => (p.salePrice ?? p.price) >= 120);
    } else {
      const [min, max] = priceRange.split('-').map(Number);
      displayProducts = displayProducts.filter((p) => {
        const price = p.salePrice ?? p.price;
        return price >= min && price <= max;
      });
    }
  }

  const handleClearFilters = () => {
    setActiveTab('all');
    setPriceRange('all');
    setCategory('');
    setSort('');
    // clear search and wishlist params
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    params.delete('wishlist');
    params.delete('category');
    params.delete('sort');
    params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <div className="page-shop-custom">
      {/* Page Title Section / Breadcrumbs */}
      <div 
        className="page-title-section section" 
        style={{ backgroundImage: "url('https://html-demo-orcin.vercel.app/premium/learts/assets/images/bg/page-title-1.webp')" }}
      >
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <div className="page-title">
                <h1 className="title">
                  {wishlist ? 'Wishlist' : search ? 'Search Results' : category ? categories.find(c => c.id === category)?.name || 'Products' : 'Shop'}
                </h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li className="breadcrumb-item active">
                    {wishlist ? 'Wishlist' : search ? `Search: ${search}` : 'Products'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Products Section */}
      <div className="section section-padding pt-0">
        
        {/* Shop Toolbar */}
        <div className="shop-toolbar border-bottom">
          <div className="container toolbar-container">
            {/* Left Tabs (Isotope filter) */}
            <div className="isotope-filter shop-product-filter">
              <button 
                className={activeTab === 'all' ? 'active' : ''} 
                onClick={() => setActiveTab('all')}
              >
                all
              </button>
              <button 
                className={activeTab === 'featured' ? 'active' : ''} 
                onClick={() => setActiveTab('featured')}
              >
                Hot Products
              </button>
              <button 
                className={activeTab === 'new' ? 'active' : ''} 
                onClick={() => setActiveTab('new')}
              >
                New Products
              </button>
              <button 
                className={activeTab === 'sales' ? 'active' : ''} 
                onClick={() => setActiveTab('sales')}
              >
                Sales Products
              </button>
            </div>

            {/* Right Controls */}
            <div className="toolbar-controls shop-toolbar-controls">
              {/* Sort dropdown */}
              <div className="product-sorting">
                <select 
                  className="nice-select" 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="">Default sorting</option>
                  <option value="asc">Sort by price: low to high</option>
                  <option value="desc">Sort by price: high to low</option>
                </select>
              </div>

              {/* Column toggle */}
              <div className="product-column-toggle d-none d-xl-flex">
                <button 
                  className={`toggle hintT-top ${columns === 5 ? 'active' : ''}`} 
                  onClick={() => setColumns(5)}
                  title="5 Columns"
                >
                  <i className="ti-layout-grid4-alt"></i>
                </button>
                <button 
                  className={`toggle hintT-top ${columns === 4 ? 'active' : ''}`} 
                  onClick={() => setColumns(4)}
                  title="4 Columns"
                >
                  <i className="ti-layout-grid3-alt"></i>
                </button>
                <button 
                  className={`toggle hintT-top ${columns === 3 ? 'active' : ''}`} 
                  onClick={() => setColumns(3)}
                  title="3 Columns"
                >
                  <i className="ti-layout-grid2-alt"></i>
                </button>
              </div>

              {/* Filters Toggle Button */}
              <button 
                className={`product-filter-toggle ${filterDrawerOpen ? 'active' : ''}`}
                onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              >
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Product Filter Panel (slides down) */}
        {filterDrawerOpen && (
          <div id="product-filter" className="product-filter bg-light py-4 border-bottom">
            <div className="container">
              <div className="row row-cols-lg-5 row-cols-md-3 row-cols-sm-2 row-cols-1 learts-mb-n30">
                
                {/* Column 1: Sort by */}
                <div className="col learts-mb-30 filter-col">
                  <h3 className="widget-title product-filter-widget-title">Sort by</h3>
                  <ul className="widget-list product-filter-widget customScroll">
                    <li>
                      <button className={sort === '' ? 'active-link' : ''} onClick={() => setSort('')}>
                        Popularity / Default
                      </button>
                    </li>
                    <li>
                      <button className={sort === 'asc' ? 'active-link' : ''} onClick={() => setSort('asc')}>
                        Price: low to high
                      </button>
                    </li>
                    <li>
                      <button className={sort === 'desc' ? 'active-link' : ''} onClick={() => setSort('desc')}>
                        Price: high to low
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Price filter */}
                <div className="col learts-mb-30 filter-col">
                  <h3 className="widget-title product-filter-widget-title">Price filter</h3>
                  <ul className="widget-list product-filter-widget customScroll">
                    <li>
                      <button className={priceRange === 'all' ? 'active-link' : ''} onClick={() => setPriceRange('all')}>
                        All
                      </button>
                    </li>
                    <li>
                      <button className={priceRange === '0-40' ? 'active-link' : ''} onClick={() => setPriceRange('0-40')}>
                        $0.00 - $40.00
                      </button>
                    </li>
                    <li>
                      <button className={priceRange === '40-80' ? 'active-link' : ''} onClick={() => setPriceRange('40-80')}>
                        $40.00 - $80.00
                      </button>
                    </li>
                    <li>
                      <button className={priceRange === '80-120' ? 'active-link' : ''} onClick={() => setPriceRange('80-120')}>
                        $80.00 - $120.00
                      </button>
                    </li>
                    <li>
                      <button className={priceRange === '120+' ? 'active-link' : ''} onClick={() => setPriceRange('120+')}>
                        $120.00 +
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Categories */}
                <div className="col learts-mb-30 filter-col">
                  <h3 className="widget-title product-filter-widget-title">Categories</h3>
                  <ul className="widget-list product-filter-widget customScroll">
                    <li>
                      <button className={category === '' ? 'active-link' : ''} onClick={() => setCategory('')}>
                        All Categories
                      </button>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <button 
                          className={category === cat.id ? 'active-link' : ''} 
                          onClick={() => setCategory(cat.id)}
                        >
                          {cat.name}
                        </button>
                        <span className="count">{cat.itemCount}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 4: Filters by colors */}
                <div className="col learts-mb-30 filter-col">
                  <h3 className="widget-title product-filter-widget-title">Filters by colors</h3>
                  <ul className="widget-colors product-filter-widget customScroll">
                    <li><a href="#" onClick={e => e.preventDefault()} className="hintT-top" data-hint="Black"><span style={{ backgroundColor: '#000000' }}>Black</span></a></li>
                    <li><a href="#" onClick={e => e.preventDefault()} className="hintT-top" data-hint="White"><span style={{ backgroundColor: '#FFFFFF', border: '1px solid #ddd' }}>White</span></a></li>
                    <li><a href="#" onClick={e => e.preventDefault()} className="hintT-top" data-hint="Dark Red"><span style={{ backgroundColor: '#b2483c' }}>Dark Red</span></a></li>
                    <li><a href="#" onClick={e => e.preventDefault()} className="hintT-top" data-hint="Flaxen"><span style={{ backgroundColor: '#d5b85a' }}>Flaxen</span></a></li>
                    <li><a href="#" onClick={e => e.preventDefault()} className="hintT-top" data-hint="Pine"><span style={{ backgroundColor: '#01796f' }}>Pine</span></a></li>
                    <li><a href="#" onClick={e => e.preventDefault()} className="hintT-top" data-hint="Tortilla"><span style={{ backgroundColor: '#997950' }}>Tortilla</span></a></li>
                  </ul>
                </div>

                {/* Column 5: Brands */}
                <div className="col learts-mb-30 filter-col">
                  <h3 className="widget-title product-filter-widget-title">Brands</h3>
                  <ul className="widget-list product-filter-widget customScroll">
                    <li><a href="#" onClick={e => e.preventDefault()}>Alexander</a> <span className="count">(2)</span></li>
                    <li><a href="#" onClick={e => e.preventDefault()}>Carmella</a> <span className="count">(4)</span></li>
                    <li><a href="#" onClick={e => e.preventDefault()}>Danielle</a> <span className="count">(7)</span></li>
                    <li><a href="#" onClick={e => e.preventDefault()}>Diana Day</a> <span className="count">(13)</span></li>
                  </ul>
                </div>

              </div>

              {/* Active filters summary */}
              {(category || sort || activeTab !== 'all' || priceRange !== 'all' || search || wishlist) && (
                <div className="active-filters-row mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                  <div className="active-filters-badges">
                    <span className="me-2 text-muted" style={{ fontSize: '0.85rem' }}>Active Filters:</span>
                    {category && <span className="filter-badge me-2">Category: {category}</span>}
                    {sort && <span className="filter-badge me-2">Sort: {sort}</span>}
                    {activeTab !== 'all' && <span className="filter-badge me-2">Tag: {activeTab}</span>}
                    {priceRange !== 'all' && <span className="filter-badge me-2">Price: ${priceRange}</span>}
                    {search && <span className="filter-badge me-2">Search: "{search}"</span>}
                    {wishlist && <span className="filter-badge me-2">Wishlist Only</span>}
                  </div>
                  <button className="btn btn-outline btn-sm" style={{ width: 'auto' }} onClick={handleClearFilters}>
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shop Grid Section */}
        <div className="container products-grid-container mt-5">
          {error && <p className="error-text">Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại.</p>}

          {/* Dynamic Grid Columns count */}
          <div className={`products row row-cols-xl-${columns} row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1`}>
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <div className="col mb-4" key={i}>
                    <ProductCardSkeleton />
                  </div>
                ))
              : displayProducts.map((product) => (
                  <div className="col mb-4" key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>

          {!isLoading && displayProducts.length === 0 && !error && (
            <div className="empty-results text-center py-5">
              <i className="far fa-folder-open mb-3" style={{ fontSize: '3rem', color: '#ccc' }}></i>
              <p className="empty-text">Không tìm thấy sản phẩm phù hợp.</p>
              <button className="btn btn-primary mt-2" onClick={handleClearFilters}>
                Quay lại cửa hàng
              </button>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && displayProducts.length > 0 && (
            <div className="pagination-wrapper mt-4">
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
