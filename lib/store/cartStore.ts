import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "../types";
import { toast } from "sonner";

interface CartStoreTypes {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItem: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStoreTypes>()(
  persist(
    (set, get) => ({
      // store item
      items: [],

      // add
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.id === product.id
        );

        if (existingItem) {
          const updateItems = currentItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );

          set({ items: updateItems });
          toast.success("Jumlah barang ditambah");
        } else {
          const newItem = { ...product, quantity: 1 };

          set({
            items: [...currentItems, newItem],
          });
          toast.success("Berhasil masuk keranjang");
        }
      },

      //remove
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        toast.success("Barang dihapus");
      },

      //update quantity
      updateQuantity: (id, qty) => {
        if (qty < 1) return;

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: qty } : item
          ),
        });
      },

      //clear cart
      clearCart: () => set({ items: [] }),

      //total item
      totalItem: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      //total price
      totalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "cart-storage",
    }
  )
);
