import api from "@/lib/axios";
import ProductFilter from "@/components/ProductFilter";
import type { Product } from "@/@types/products";

export default async function WomensClothingPage() {
  const response = await api.get<Product[]>('products');
  const allProducts = response.data;

  const womensClothingProducts = allProducts.filter(
    (product) => product.category === "women's clothing"
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Womens Clothing</h1>
        <p className="text-zinc-400">Explore our collection of womens fashion and apparel.</p>
      </div>
      <ProductFilter 
        products={womensClothingProducts} 
        hideCategoryFilter={true}
      />
    </div>
  );
}
