import api from "@/lib/axios";
import ProductFilter from "@/components/ProductFilter";
import type { Product } from "@/@types/products";

export default async function JeweleryPage() {
  const response = await api.get<Product[]>('products');
  const allProducts = response.data;

  const jeweleryProducts = allProducts.filter(
    (product) => product.category === "jewelery"
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Jewelery</h1>
        <p className="text-zinc-400">Explore our collection of jewelry products.</p>
      </div>
      <ProductFilter 
        products={jeweleryProducts} 
        hideCategoryFilter={true}
      />
    </div>
  );
}
