import api from "@/lib/axios";
import ProductFilter from "@/components/ProductFilter";
import type { Product } from "@/@types/products";

export default async function Home() {
  const response = await api.get<Product[]>('products');
  const products = response.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Produtos</h1>
        <p className="text-zinc-400">Explore nossa coleção completa</p>
      </div>
      <ProductFilter products={products} />
    </div>
  );
}
