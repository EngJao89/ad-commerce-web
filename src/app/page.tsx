import api from "@/lib/axios";
import ProductCard from "@/components/ProductCard";
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
