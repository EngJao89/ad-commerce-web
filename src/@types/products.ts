export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export type ProductDetailProps = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export type ProductFilterProps = {
  products: Product[];
}

export type SortByPrice = "asc" | "desc" | null;
export type SortByName = "asc" | "desc" | null;

export type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
}

export interface ProductFilterComponentProps extends ProductFilterProps {
  defaultCategory?: string;
  hideCategoryFilter?: boolean;
}

export type ProductDetailClientProps = {
  productId: string;
}

export type ProductQuantityControlsProps = {
  productId: number;
}

export type ProductsGridSkeletonProps = {
  count?: number;
}
