export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span>{message}</span>
      <button onClick={onClose} aria-label="Đóng thông báo">
        ×
      </button>
    </div>
  );
}
