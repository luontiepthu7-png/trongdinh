export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="Phân trang">
      <button className="page-btn" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Trang trước">
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`page-btn ${p === page ? 'active' : ''}`}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}
      <button
        className="page-btn"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Trang sau"
      >
        ›
      </button>
    </nav>
  );
}
