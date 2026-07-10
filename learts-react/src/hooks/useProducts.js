import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import { useWishlistStore } from '../store/wishlistStore';

const PAGE_SIZE = 8;

/**
 * Hook quản lý danh sách sản phẩm cho trang Shop.
 * Đồng bộ filter/sort/page/search/wishlist với query string trên URL để có thể chia sẻ link
 * hoặc back/forward trên trình duyệt vẫn giữ đúng trạng thái.
 */
export default function useProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page') || 1);
  const search = searchParams.get('search') || '';
  const wishlist = searchParams.get('wishlist') === 'true';

  const wishlistItems = useWishlistStore((s) => s.items);
  const wishlistIds = wishlistItems.map((item) => item.id);

  const [data, setData] = useState({ items: [], total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getProducts({
      category: category || undefined,
      sort: sort || undefined,
      page,
      pageSize: PAGE_SIZE,
      search: search || undefined,
      wishlist: wishlist || undefined,
      wishlistIds,
    })
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [category, sort, page, search, wishlist, JSON.stringify(wishlistIds)]);

  function updateParams(next) {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  }

  function setCategory(newCategory) {
    updateParams({ category: newCategory, page: 1 });
  }

  function setSort(newSort) {
    updateParams({ sort: newSort, page: 1 });
  }

  function setPage(newPage) {
    updateParams({ page: newPage });
  }

  return {
    products: data.items,
    total: data.total,
    totalPages: data.totalPages,
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
  };
}
