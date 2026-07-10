import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [], // list of products

      addItem: (product) => {
        const items = get().items;
        const exists = items.some((item) => item.id === product.id);
        if (!exists) {
          set({ items: [...items, product] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      toggleItem: (product) => {
        const items = get().items;
        const exists = items.some((item) => item.id === product.id);
        if (exists) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      hasItem: (id) => {
        return get().items.some((item) => item.id === id);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'learts-wishlist-storage',
    }
  )
);
