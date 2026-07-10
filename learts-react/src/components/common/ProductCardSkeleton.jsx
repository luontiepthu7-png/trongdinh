export default function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton">
      <div className="skeleton-block image" />
      <div className="product-card-body">
        <div className="skeleton-block text" />
        <div className="skeleton-block text short" />
        <div className="skeleton-block button" />
      </div>
    </div>
  );
}
