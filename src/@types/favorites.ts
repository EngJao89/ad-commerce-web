import type { Product } from "./products";

export type FavoritesContextValue = {
  items: Product[];
  add: (product: Product) => void;
  remove: (productId: number) => void;
  toggle: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
};
