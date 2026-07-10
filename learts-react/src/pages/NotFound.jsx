import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 - Không tìm thấy trang - Learts';
  }, []);
  return (
    <div className="container page-not-found">
      <h1>404</h1>
      <p>Trang bạn tìm không tồn tại.</p>
      <Link to="/" className="btn btn-primary">
        Về trang chủ
      </Link>
    </div>
  );
}
