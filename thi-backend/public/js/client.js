// Learts Client Store JavaScript Logic - Interacting with RESTful APIs

// State
let allProducts = [];
let filteredProducts = [];
let products = []; // Contains current page's products for backward compatibility
let categories = [];
let cart = [];
let currentPage = 1;
let totalPages = 1;
const limit = 8; // Show 8 products per page

// Filter States
let selectedCategoryId = '';
let activeBadgeFilter = 'all';
let activePriceFilter = 'all';
let activeColorFilter = '';
let activeSort = 'default';
let searchQuery = '';

// Quick View State
let qvProduct = null;
let qvQty = 1;

// Mock Colors Mapping for seeded products
const mockColorsMap = {
  '3D Attractive Pot': ['White', 'Flaxen'],
  'Abstract Folded Pots': ['White', 'Tortilla'],
  'Adhesive Tape Dispenser': ['Tortilla', 'Black'],
  'Decorative Christmas Fox': ['Dark Red', 'Flaxen'],
  'Clear Silicate Teapot': ['White', 'Pine'],
  'Bouncer Measuring Cup': ['White'],
  'Boho Beard Mug': ['Tortilla', 'White'],
  'Antique Sewing Scissors': ['Black', 'Tortilla'],
  'Cape Cottage Playhouse': ['Pine', 'Flaxen', 'White']
};

// Elements
const productGrid = document.getElementById('client-product-grid');
const categoryTabs = document.getElementById('client-category-tabs');
const paginationBox = document.getElementById('client-pagination');
const cartCountBadges = document.querySelectorAll('.cart-count');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartDrawerBody = document.getElementById('cart-drawer-body');
const cartSubtotalPrice = document.getElementById('cart-subtotal-price');

// Checkout elements
const checkoutModalOverlay = document.getElementById('checkout-modal-overlay');
const checkoutForm = document.getElementById('checkout-form');
const checkoutSummarySubtotal = document.getElementById('checkout-summary-subtotal');
const checkoutSummaryTotal = document.getElementById('checkout-summary-total');

document.addEventListener('DOMContentLoaded', () => {
  // Initialize
  initCart();
  loadCategories();
  loadProducts();
  initSlider();
  initFilterDrawer();
  initQuickView();

  // Setup Event Listeners
  document.getElementById('cart-btn').addEventListener('click', openCart);
  document.getElementById('close-cart-btn').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  document.getElementById('checkout-trigger-btn').addEventListener('click', openCheckout);
  document.getElementById('close-checkout-btn').addEventListener('click', closeCheckout);
  document.getElementById('checkout-cancel-btn').addEventListener('click', closeCheckout);
  checkoutModalOverlay.addEventListener('click', (e) => {
    if (e.target === checkoutModalOverlay) closeCheckout();
  });

  checkoutForm.addEventListener('submit', handleCheckoutSubmit);

  // Search input listener
  const searchInput = document.getElementById('header-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      currentPage = 1;
      applyFiltersAndRender();
    });
  }

  // Sort dropdown change listener
  const sortSelect = document.getElementById('client-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      applyFiltersAndRender();
    });
  }
});

// ==========================================================================
// 1. Fetch & Render Catalog
// ==========================================================================

// Load Categories
async function loadCategories() {
  try {
    const res = await fetch('/api/categories');
    const result = await res.json();
    if (result.success) {
      categories = result.data;
      
      // Render Category Tabs if elements exist (like in shop.html)
      if (categoryTabs) {
        categoryTabs.innerHTML = `
          <button class="category-tab-btn active" onclick="filterCategory('')">All</button>
        `;

        categories.forEach(cat => {
          const btn = `
            <button class="category-tab-btn" data-id="${cat._id}" onclick="filterCategory('${cat._id}')">${cat.name}</button>
          `;
          categoryTabs.insertAdjacentHTML('beforeend', btn);
        });
      }

      // Render Categories panel list in the filters drawer
      const panelCategoriesList = document.getElementById('panel-categories-list');
      if (panelCategoriesList) {
        panelCategoriesList.innerHTML = `
          <li><a href="#" onclick="filterCategoryPanel('', event)" class="active">All</a></li>
        `;

        categories.forEach(cat => {
          const li = `
            <li><a href="#" data-id="${cat._id}" onclick="filterCategoryPanel('${cat._id}', event)">${cat.name}</a></li>
          `;
          panelCategoriesList.insertAdjacentHTML('beforeend', li);
        });
      }
    }
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
}

// Filter products by category tab
function filterCategory(categoryId) {
  selectedCategoryId = categoryId;
  currentPage = 1;

  // Update active state of tabs
  if (categoryTabs) {
    const buttons = categoryTabs.querySelectorAll('.category-tab-btn');
    buttons.forEach(btn => {
      if (categoryId === '' && btn.textContent.toLowerCase() === 'all') {
        btn.classList.add('active');
      } else if (btn.getAttribute('data-id') === categoryId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Update active state of categories in panel
  const panelCategoriesList = document.getElementById('panel-categories-list');
  if (panelCategoriesList) {
    const links = panelCategoriesList.querySelectorAll('a');
    links.forEach(link => {
      const linkId = link.getAttribute('data-id') || '';
      if (linkId === categoryId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  applyFiltersAndRender();
}

// Filter category from drawer list
function filterCategoryPanel(categoryId, event) {
  if (event) event.preventDefault();
  filterCategory(categoryId);
}

// Load Products
async function loadProducts() {
  if (productGrid) {
    productGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: var(--text-muted);">
        <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
        <p style="margin-top: 10px;">Loading handmade products...</p>
      </div>
    `;
  }

  try {
    const res = await fetch('/api/products?limit=100');
    const result = await res.json();

    if (result.success) {
      allProducts = result.data.products;
      
      // Inject mock colors mapping
      allProducts = allProducts.map(p => ({
        ...p,
        colors: mockColorsMap[p.name] || ['White']
      }));

      applyFiltersAndRender();
    }
  } catch (err) {
    console.error('Error loading products:', err);
    if (productGrid) {
      productGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #b2483c;">
          <i class="fa-solid fa-triangle-exclamation fa-2x"></i>
          <p style="margin-top: 10px;">Failed to connect to the store API.</p>
        </div>
      `;
    }
  }
}

// Apply Filters & Render
function applyFiltersAndRender() {
  filteredProducts = [...allProducts];

  // 1. Category Filter
  if (selectedCategoryId) {
    filteredProducts = filteredProducts.filter(p => {
      const catId = p.category._id || p.category;
      return catId === selectedCategoryId;
    });
  }

  // 2. Badge Filter
  if (activeBadgeFilter !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.badge === activeBadgeFilter);
  }

  // 3. Price Filter
  if (activePriceFilter !== 'all') {
    if (activePriceFilter === '0-50') {
      filteredProducts = filteredProducts.filter(p => p.price >= 0 && p.price <= 50);
    } else if (activePriceFilter === '50-100') {
      filteredProducts = filteredProducts.filter(p => p.price > 50 && p.price <= 100);
    } else if (activePriceFilter === '100-150') {
      filteredProducts = filteredProducts.filter(p => p.price > 100 && p.price <= 150);
    } else if (activePriceFilter === '150+') {
      filteredProducts = filteredProducts.filter(p => p.price > 150);
    }
  }

  // 4. Color Filter
  if (activeColorFilter) {
    filteredProducts = filteredProducts.filter(p => p.colors.includes(activeColorFilter));
  }

  // 5. Search Filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q)
    );
  }

  // 6. Sorting
  if (activeSort === 'date') {
    filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (activeSort === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else {
    // default
    filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // 7. Paginate
  const total = filteredProducts.length;
  totalPages = Math.ceil(total / limit);
  if (currentPage > totalPages) currentPage = 1;
  if (currentPage < 1) currentPage = 1;

  const startIdx = (currentPage - 1) * limit;
  const endIdx = startIdx + limit;
  
  products = filteredProducts.slice(startIdx, endIdx);

  // Render Grid & Pagination
  renderProductGrid();
  renderPagination({
    page: currentPage,
    pages: totalPages,
    total: total
  });

  // Update Indicator Badge
  updateActiveFiltersIndicator();
}

// Render Products Grid
function renderProductGrid() {
  if (!productGrid) return;

  if (!products || products.length === 0) {
    productGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: var(--text-muted);">
        No products available.
      </div>
    `;
    return;
  }

  productGrid.innerHTML = '';
  products.forEach(prod => {
    const isOutOfStock = prod.stock === 0;

    // Badge HTML
    let badgeHtml = '';
    if (prod.badge && prod.badge !== 'none') {
      badgeHtml = `<span class="banner-badge badge-left" style="top: 15px; left: 15px; text-transform: uppercase;">${prod.badge}</span>`;
    }

    const card = `
      <div class="product-card">
        <div class="product-thumb">
          ${badgeHtml}
          <img src="${prod.imageUrl}" alt="${prod.name}">
          <img class="img-hover" src="${prod.imageUrl}" alt="${prod.name}" style="filter: brightness(0.96);">
          
          <div class="product-actions">
            ${isOutOfStock 
              ? '' 
              : `<button class="action-btn" onclick="addToCart('${prod._id}')" title="Add to Cart"><i class="fa-solid fa-shopping-cart"></i></button>`
            }
            <button class="action-btn" onclick="showProductDetails('${prod._id}')" title="Quick View"><i class="fa-solid fa-search"></i></button>
          </div>
        </div>
        <div class="product-info">
          <h6 class="product-title" onclick="showProductDetails('${prod._id}')">${prod.name}</h6>
          <div class="product-price">$${prod.price.toFixed(2)}</div>
          ${isOutOfStock 
            ? '<div class="product-stock-out">Out of Stock</div>' 
            : `<div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Tồn kho: ${prod.stock}</div>`
          }
        </div>
      </div>
    `;
    productGrid.insertAdjacentHTML('beforeend', card);
  });
}

// Render Page Numbers
function renderPagination(pagination) {
  if (!paginationBox) return;

  paginationBox.innerHTML = '';
  const { page, pages } = pagination;

  if (pages <= 1) return;

  // Prev
  paginationBox.insertAdjacentHTML('beforeend', `
    <button class="page-btn" onclick="changePage(${page - 1})" ${page === 1 ? 'disabled' : ''}>
      <i class="fa-solid fa-chevron-left"></i>
    </button>
  `);

  // Numbers
  for (let i = 1; i <= pages; i++) {
    paginationBox.insertAdjacentHTML('beforeend', `
      <button class="page-btn ${i === page ? 'active' : ''}" onclick="changePage(${i})">${i}</button>
    `);
  }

  // Next
  paginationBox.insertAdjacentHTML('beforeend', `
    <button class="page-btn" onclick="changePage(${page + 1})" ${page === pages ? 'disabled' : ''}>
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  `);
}

function changePage(page) {
  currentPage = page;
  applyFiltersAndRender();
}

function showProductDetails(productId) {
  // Search in allProducts so that we can view details of any loaded product
  const prod = allProducts.find(p => p._id === productId);
  if (!prod) return;

  qvProduct = prod;
  qvQty = 1;

  const overlay = document.getElementById('quick-view-overlay');
  const img = document.getElementById('qv-product-img');
  const name = document.getElementById('qv-product-name');
  const price = document.getElementById('qv-product-price');
  const oldPrice = document.getElementById('qv-product-oldprice');
  const desc = document.getElementById('qv-product-desc');
  const stockBadge = document.getElementById('qv-product-stock-badge');
  const qtyInput = document.getElementById('qv-qty-input');

  if (overlay && img && name && price && desc) {
    img.src = prod.imageUrl;
    img.alt = prod.name;
    name.textContent = prod.name;
    price.textContent = `$${prod.price.toFixed(2)}`;
    
    if (prod.originalPrice) {
      oldPrice.textContent = `$${prod.originalPrice.toFixed(2)}`;
      oldPrice.style.display = 'inline';
    } else {
      oldPrice.style.display = 'none';
    }
    
    desc.textContent = prod.description;
    
    if (prod.stock > 0) {
      stockBadge.textContent = 'In stock';
      stockBadge.className = 'badge badge-pending';
      stockBadge.style.backgroundColor = 'rgba(168, 138, 100, 0.1)';
      stockBadge.style.color = 'var(--primary)';
    } else {
      stockBadge.textContent = 'Out of stock';
      stockBadge.className = 'badge';
      stockBadge.style.backgroundColor = '#fce8e6';
      stockBadge.style.color = '#b2483c';
    }

    if (qtyInput) qtyInput.value = qvQty;
    overlay.classList.add('active');
  } else {
    // fallback if elements don't exist (like on shop.html where quick view modal might not be present)
    alert(`${prod.name}\n\n${prod.description}\n\nPrice: $${prod.price.toFixed(2)}\nTồn kho: ${prod.stock} cái`);
  }
}

// ==========================================================================
// 2. Shopping Cart Management
// ==========================================================================

function initCart() {
  const savedCart = localStorage.getItem('learts_cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      cart = [];
    }
  }
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('learts_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  // Update badge count
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountBadges.forEach(badge => {
    badge.textContent = totalQty;
  });

  // Render cart items inside side panel
  renderCartDrawer();
}

// Add Item
function addToCart(productId) {
  const product = products.find(p => p._id === productId);
  if (!product) return;

  // Check if product is already in cart
  const cartItem = cart.find(item => item.product._id === productId);

  if (cartItem) {
    if (cartItem.quantity >= product.stock) {
      showToast(`Không thể thêm. Giới hạn tồn kho là ${product.stock} cái`, 'error');
      return;
    }
    cartItem.quantity += 1;
  } else {
    cart.push({
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock
      },
      quantity: 1
    });
  }

  saveCart();
  showToast(`Đã thêm '${product.name}' vào giỏ hàng!`, 'success');
  openCart();
}

// Remove Item
function removeFromCart(productId) {
  cart = cart.filter(item => item.product._id !== productId);
  saveCart();
}

// Alter Quantities
function updateCartQuantity(productId, change) {
  const cartItem = cart.find(item => item.product._id === productId);
  if (!cartItem) return;

  const newQty = cartItem.quantity + change;

  if (newQty <= 0) {
    removeFromCart(productId);
  } else {
    // Check stock limit
    if (newQty > cartItem.product.stock) {
      showToast(`Không thể vượt quá số lượng tồn kho (${cartItem.product.stock} cái)`, 'error');
      return;
    }
    cartItem.quantity = newQty;
    saveCart();
  }
}

// Subtotal Sum
function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
}

// Render Drawer List
function renderCartDrawer() {
  if (cart.length === 0) {
    cartDrawerBody.innerHTML = `
      <div class="cart-empty-message">
        <i class="fa-solid fa-basket-shopping fa-3x" style="color: var(--border-color); margin-bottom: 15px;"></i>
        <p>Your cart is empty.</p>
      </div>
    `;
    cartSubtotalPrice.textContent = '$0.00';
    document.getElementById('checkout-trigger-btn').disabled = true;
    document.getElementById('checkout-trigger-btn').style.opacity = '0.5';
    return;
  }

  document.getElementById('checkout-trigger-btn').disabled = false;
  document.getElementById('checkout-trigger-btn').style.opacity = '1';

  cartDrawerBody.innerHTML = '';
  cart.forEach(item => {
    const row = `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.product.imageUrl}" alt="${item.product.name}">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.product.name}</div>
          <div class="cart-item-price">$${item.product.price.toFixed(2)}</div>
          <div class="cart-item-qty-control">
            <button class="qty-btn" onclick="updateCartQuantity('${item.product._id}', -1)">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="updateCartQuantity('${item.product._id}', 1)">+</button>
          </div>
        </div>
        <button class="remove-item-btn" onclick="removeFromCart('${item.product._id}')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;
    cartDrawerBody.insertAdjacentHTML('beforeend', row);
  });

  cartSubtotalPrice.textContent = `$${getCartTotal().toFixed(2)}`;
}

function openCart() {
  cartDrawer.classList.add('active');
  cartOverlay.classList.add('active');
}

function closeCart() {
  cartDrawer.classList.remove('active');
  cartOverlay.classList.remove('active');
}

// ==========================================================================
// 3. Checkout Operations
// ==========================================================================

function openCheckout() {
  if (cart.length === 0) return;
  closeCart();

  const total = getCartTotal();
  checkoutSummarySubtotal.textContent = `$${total.toFixed(2)}`;
  checkoutSummaryTotal.textContent = `$${total.toFixed(2)}`;

  checkoutModalOverlay.classList.add('active');
}

function closeCheckout() {
  checkoutModalOverlay.classList.remove('active');
  checkoutForm.reset();
}

// Submit Order to Backend API
async function handleCheckoutSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const address = document.getElementById('cust-address').value.trim();

  // Map cart details for REST API: { productId, quantity }
  const itemsPayload = cart.map(item => ({
    productId: item.product._id,
    quantity: item.quantity
  }));

  const payload = {
    customerName: name,
    customerPhone: phone,
    customerAddress: address,
    items: itemsPayload
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
      showToast('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.', 'success');
      
      // Clear Cart
      cart = [];
      saveCart();
      closeCheckout();

      // Refresh product grid to show updated stock count
      loadProducts();
    } else {
      // Handles Out-Of-Stock DB errors
      alert(`ĐẶT HÀNG THẤT BẠI:\n\n${result.message}`);
    }
  } catch (err) {
    console.error(err);
    showToast('Failed to connect to order server', 'error');
  }
}

// Toast notification helper
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-message">${message}</div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// ==========================================================================
// 4. Hero Carousel Slider Logic (home-2 swiper slider replication)
// ==========================================================================
function initSlider() {
  const sliderContainer = document.querySelector('.slider-container');
  if (!sliderContainer) return;

  const slides = sliderContainer.querySelectorAll('.slide-item');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const currentPageIndicator = document.getElementById('slider-current-page');
  
  if (slides.length === 0) return;

  let currentSlideIndex = 0;
  let slideInterval;

  function showSlide(index) {
    if (index >= slides.length) {
      currentSlideIndex = 0;
    } else if (index < 0) {
      currentSlideIndex = slides.length - 1;
    } else {
      currentSlideIndex = index;
    }

    slides.forEach((slide, idx) => {
      if (idx === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    if (currentPageIndicator) {
      currentPageIndicator.textContent = currentSlideIndex + 1;
    }
  }

  function nextSlide() {
    showSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    showSlide(currentSlideIndex - 1);
  }

  function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, 6000);
  }

  function stopAutoSlide() {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoSlide();
    });
  }

  sliderContainer.addEventListener('mouseenter', stopAutoSlide);
  sliderContainer.addEventListener('mouseleave', startAutoSlide);

  showSlide(currentSlideIndex);
  startAutoSlide();
}

// ==========================================================================
// 5. Drawer Filter Panel Logic
// ==========================================================================
function initFilterDrawer() {
  const toggleBtn = document.getElementById('toggle-filter-panel-btn');
  const panel = document.getElementById('product-filters-panel');
  if (toggleBtn && panel) {
    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('active');
    });
  }

  // Setup badge buttons click listeners
  const badgeBtns = document.querySelectorAll('#product-badge-filters .filter-badge-btn');
  badgeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      badgeBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeBadgeFilter = e.target.getAttribute('data-filter');
      currentPage = 1;
      applyFiltersAndRender();
    });
  });
}

// Apply Sort from filters drawer
function applyPanelSort(sortVal, event) {
  if (event) event.preventDefault();
  activeSort = sortVal;
  
  // Sync toolbar sorting dropdown
  const sortSelect = document.getElementById('client-sort-select');
  if (sortSelect) sortSelect.value = sortVal;
  
  // Highlight active link in drawer
  const links = event.currentTarget.closest('.filter-links-list').querySelectorAll('a');
  links.forEach(l => l.classList.remove('active'));
  event.currentTarget.classList.add('active');

  applyFiltersAndRender();
}

// Apply Price Filter from drawer
function applyPriceFilter(priceRange, event) {
  if (event) event.preventDefault();
  activePriceFilter = priceRange;

  const links = event.currentTarget.closest('.filter-links-list').querySelectorAll('a');
  links.forEach(l => l.classList.remove('active'));
  event.currentTarget.classList.add('active');

  currentPage = 1;
  applyFiltersAndRender();
}

// Apply Color Filter
function filterByColor(colorName) {
  if (activeColorFilter === colorName) {
    activeColorFilter = ''; // Toggle select off
  } else {
    activeColorFilter = colorName;
  }

  const dots = document.querySelectorAll('.colors-circle-grid .color-dot');
  dots.forEach(dot => {
    if (dot.getAttribute('title') === activeColorFilter) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  currentPage = 1;
  applyFiltersAndRender();
}

// Update active filters visual indicator
function updateActiveFiltersIndicator() {
  const indicator = document.getElementById('active-filter-indicator');
  const badgeVal = document.getElementById('filter-badge-val');
  if (!indicator || !badgeVal) return;

  const activeFilters = [];

  if (selectedCategoryId) {
    const cat = categories.find(c => c._id === selectedCategoryId);
    if (cat) activeFilters.push(`Category: ${cat.name}`);
  }
  if (activeBadgeFilter !== 'all') {
    activeFilters.push(`Badge: ${activeBadgeFilter.toUpperCase()}`);
  }
  if (activePriceFilter !== 'all') {
    activeFilters.push(`Price: $${activePriceFilter}`);
  }
  if (activeColorFilter) {
    activeFilters.push(`Color: ${activeColorFilter}`);
  }
  if (searchQuery) {
    activeFilters.push(`Search: "${searchQuery}"`);
  }

  if (activeFilters.length > 0) {
    indicator.style.display = 'flex';
    badgeVal.innerHTML = `${activeFilters.join(' | ')} <i class="fa-solid fa-xmark" style="cursor: pointer; margin-left: 8px;" onclick="clearActiveFilters()"></i>`;
  } else {
    indicator.style.display = 'none';
  }
}

// Clear all active filters
function clearActiveFilters() {
  selectedCategoryId = '';
  activeBadgeFilter = 'all';
  activePriceFilter = 'all';
  activeColorFilter = '';
  searchQuery = '';
  activeSort = 'default';

  if (categoryTabs) {
    const buttons = categoryTabs.querySelectorAll('.category-tab-btn');
    buttons.forEach(btn => {
      if (btn.textContent.toLowerCase() === 'all') {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  const badgeBtns = document.querySelectorAll('#product-badge-filters .filter-badge-btn');
  badgeBtns.forEach(btn => {
    if (btn.getAttribute('data-filter') === 'all') {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const sortSelect = document.getElementById('client-sort-select');
  if (sortSelect) sortSelect.value = 'default';

  const panelList = document.getElementById('panel-categories-list');
  if (panelList) {
    const links = panelList.querySelectorAll('a');
    links.forEach(l => {
      if (l.textContent.toLowerCase() === 'all') {
        l.classList.add('active');
      } else {
        l.classList.remove('active');
      }
    });
  }

  const priceLinks = document.querySelectorAll('.filter-column:nth-child(2) .filter-links-list a');
  priceLinks.forEach(l => {
    if (l.textContent.toLowerCase() === 'all') {
      l.classList.add('active');
    } else {
      l.classList.remove('active');
    }
  });

  const sortLinks = document.querySelectorAll('.filter-column:nth-child(1) .filter-links-list a');
  sortLinks.forEach(l => {
    if (l.textContent.toLowerCase() === 'default') {
      l.classList.add('active');
    } else {
      l.classList.remove('active');
    }
  });

  const dots = document.querySelectorAll('.colors-circle-grid .color-dot');
  dots.forEach(dot => dot.classList.remove('active'));

  const searchInput = document.getElementById('header-search-input');
  if (searchInput) searchInput.value = '';

  currentPage = 1;
  applyFiltersAndRender();
}

// Navigation helpers called by page content
function scrollToProducts(event) {
  if (event) event.preventDefault();
  const catalog = document.getElementById('products-catalog-section');
  if (catalog) {
    catalog.scrollIntoView({ behavior: 'smooth' });
  }
}

function filterCategoryByName(categoryName) {
  const cat = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
  if (cat) {
    filterCategory(cat._id);
    scrollToProducts();
  } else {
    console.log('Category name not found:', categoryName);
  }
}

// ==========================================================================
// 6. Quick View Modal Operations
// ==========================================================================
function initQuickView() {
  const overlay = document.getElementById('quick-view-overlay');
  const closeBtn = document.getElementById('close-quickview-btn');
  const qtyMinus = document.getElementById('qv-qty-minus');
  const qtyPlus = document.getElementById('qv-qty-plus');
  const qtyInput = document.getElementById('qv-qty-input');
  const addToCartBtn = document.getElementById('qv-add-to-cart-btn');

  if (!overlay) return;

  const closeQuickView = () => {
    overlay.classList.remove('active');
    qvProduct = null;
  };

  if (closeBtn) closeBtn.addEventListener('click', closeQuickView);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeQuickView();
  });

  if (qtyMinus) {
    qtyMinus.addEventListener('click', () => {
      if (qvQty > 1) {
        qvQty--;
        if (qtyInput) qtyInput.value = qvQty;
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', () => {
      if (qvProduct && qvQty < qvProduct.stock) {
        qvQty++;
        if (qtyInput) qtyInput.value = qvQty;
      } else if (qvProduct) {
        showToast(`Không thể chọn quá số lượng tồn kho (${qvProduct.stock})`, 'error');
      }
    });
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      if (!qvProduct) return;
      
      const cartItem = cart.find(item => item.product._id === qvProduct._id);
      if (cartItem) {
        if (cartItem.quantity + qvQty > qvProduct.stock) {
          showToast(`Không thể thêm thêm. Giới hạn tồn kho là ${qvProduct.stock} cái`, 'error');
          return;
        }
        cartItem.quantity += qvQty;
      } else {
        cart.push({
          product: {
            _id: qvProduct._id,
            name: qvProduct.name,
            price: qvProduct.price,
            imageUrl: qvProduct.imageUrl,
            stock: qvProduct.stock
          },
          quantity: qvQty
        });
      }
      
      saveCart();
      showToast(`Đã thêm ${qvQty} '${qvProduct.name}' vào giỏ hàng!`, 'success');
      closeQuickView();
      openCart();
    });
  }
}
