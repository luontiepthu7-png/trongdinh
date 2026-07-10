import useFeaturedProducts from '../../hooks/useFeaturedProducts';
import ProductCard from '../product/ProductCard';
import Loading from '../common/Loading';
import ProductCardSkeleton from '../common/ProductCardSkeleton';

export default function FeaturedProducts() {
  const { products, isLoading, error } = useFeaturedProducts();

  if (error) return <p className="error-text">Không thể tải sản phẩm nổi bật.</p>;

  return (
    <section className="featured-section container">
      <h2 className="section-title">Sản phẩm nổi bật</h2>
      <div className="product-grid">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
