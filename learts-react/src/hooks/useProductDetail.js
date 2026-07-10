import { useEffect, useState } from 'react';
import { getProductById } from '../services/api';

export default function useProductDetail(productId) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    getProductById(productId)
      .then((data) => {
        if (isMounted) setProduct(data);
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
  }, [productId]);

  return { product, isLoading, error };
}
