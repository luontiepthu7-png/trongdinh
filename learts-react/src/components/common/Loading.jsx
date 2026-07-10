export default function Loading({ label = 'Đang tải...' }) {
  return (
    <div className="loading-wrap" role="status" aria-live="polite">
      <span className="spinner" />
      <span className="loading-label">{label}</span>
    </div>
  );
}
