"use client";

import { useEffect, useState } from "react";

import api from "@/lib/axios";
import { showApiError } from "@/lib/toast";
import type { Product } from "@/@types/products";
import ProductFilter from "@/components/ProductFilter";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get<Product[]>('products');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        showApiError(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Products</h1>
          <p className="text-zinc-400">Explore our collection of products.</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

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
