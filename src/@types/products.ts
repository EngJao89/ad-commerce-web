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
