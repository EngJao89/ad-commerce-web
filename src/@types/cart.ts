import type { Product } from "./products";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartContextValue = {
  items: CartItem[];
  add: (product: Product, quantity: number) => void;
  remove: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
};
