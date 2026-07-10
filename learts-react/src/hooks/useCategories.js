import { useEffect, useState } from 'react';
import { getCategories } from '../services/api';

/**
 * Hook lấy danh sách danh mục sản phẩm, tự quản lý trạng thái loading/error.
 */
export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      setIsLoading(true);
      try {
        const data = await getCategories();
        if (isMounted) setCategories(data);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, isLoading, error };
}
