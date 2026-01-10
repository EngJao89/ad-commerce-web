import api from "@/lib/axios";
import type { Product } from "@/@types/products";
import ProductFilter from "@/components/ProductFilter";
import EmptyState from "@/components/EmptyState";

export default async function Home() {  
  const response = await api.get<Product[]>('products');
  const products = response.data;

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Products</h1>
          <p className="text-zinc-400">Explore our collection of products.</p>
        </div>
        <EmptyState
          title="No products available"
          message="We couldn't load any products at the moment. Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Products</h1>
        <p className="text-zinc-400">Explore our collection of products.</p>
      </div>
      <ProductFilter products={products} />
    </div>
  );
}
