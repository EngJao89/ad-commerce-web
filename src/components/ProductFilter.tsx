"use client";

import { useState, useMemo } from "react";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/@types/products";

interface ProductFilterProps {
  products: Product[];
}

export default function ProductFilter({ products }: ProductFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category))
    );
    return uniqueCategories.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }
    return products.filter(
      (product) => product.category === selectedCategory
    );
  }, [products, selectedCategory]);

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <label htmlFor="category-filter" className="text-sm font-medium text-zinc-400">
          Filtrar por categoria:
        </label>
        <NativeSelect
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="min-w-[200px] text-zinc-400"
        >
          <NativeSelectOption value="all">Todas as categorias</NativeSelectOption>
          {categories.map((category) => (
            <NativeSelectOption key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <span className="text-sm text-zinc-500">
          {filteredProducts.length} produto(s) encontrado(s)
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </>
  );
}

