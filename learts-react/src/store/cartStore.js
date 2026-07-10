import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store toàn cục quản lý giỏ hàng (Cart State) bằng Zustand.
// Middleware `persist` tự động đồng bộ state với localStorage,
// nên khi F5 tải lại trang, giỏ hàng vẫn còn nguyên (đáp ứng yêu cầu 4.1).

function getUnitPrice(item) {
  return item.salePrice ?? item.price;
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { id, name, image, price, salePrice, stock, quantity }

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.id === product.id);

        if (existing) {
          const nextQty = Math.min(existing.quantity + quantity, product.stock ?? 999);
          set({
            items: items.map((i) => (i.id === product.id ? { ...i, quantity: nextQty } : i)),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: product.id,
                name: product.name,
                image: product.images?.[0],
                price: product.price,
                salePrice: product.salePrice ?? null,
                stock: product.stock,
                quantity: Math.min(quantity, product.stock ?? 999),
              },
            ],
          });
        }
      },

      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((i) => {
            if (i.id !== id) return i;
            const clamped = Math.max(1, Math.min(quantity, i.stock ?? 999));
            return { ...i, quantity: clamped };
          }),
        });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      clearCart: () => set({ items: [] }),

      // Selectors (dùng như hàm tính toán dẫn xuất từ state)
      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, i) => sum + getUnitPrice(i) * i.quantity, 0),
    }),
    {
      name: 'learts-cart-storage', // key lưu trong localStorage
    }
  )
);

export { getUnitPrice };
