import { create } from "zustand";
import { persist } from "zustand/middleware";

// Post data itself lives in the backend now (see postService.js). This store only holds
// the creator's reusable category-name list — a pure local convenience, not backend-tracked.
const usePostStore = create(
  persist(
    (set, get) => ({
      categories: [],

      addCategory: (name) => {
        const value = name.trim();
        if (!value || get().categories.includes(value)) return;
        set({ categories: [...get().categories, value] });
      },

      removeCategory: (name) =>
        set({ categories: get().categories.filter((c) => c !== name) }),
    }),
    { name: "patronnp-posts" }
  )
);

export default usePostStore;
