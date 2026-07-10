import useCategories from '../../hooks/useCategories';

export default function ShopToolbar({ category, sort, total, onCategoryChange, onSortChange }) {
  const { categories } = useCategories();

  return (
    <div className="shop-toolbar">
      <div className="filter-group">
        <label htmlFor="category-filter">Danh mục:</label>
        <select
          id="category-filter"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Tất cả</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="result-count">{total} sản phẩm</div>

      <div className="filter-group">
        <label htmlFor="sort-select">Sắp xếp:</label>
        <select id="sort-select" value={sort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="">Mặc định</option>
          <option value="asc">Giá: Thấp đến Cao</option>
          <option value="desc">Giá: Cao đến Thấp</option>
        </select>
      </div>
    </div>
  );
}
