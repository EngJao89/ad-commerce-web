"use client";

import { useState, useMemo } from "react";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ProductCard from "@/components/ProductCard";
import type { ProductFilterProps, SortByPrice, SortByName } from "@/@types/products";

export default function ProductFilter({ products }: ProductFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortByPrice, setSortByPrice] = useState<SortByPrice>(null);
  const [sortByName, setSortByName] = useState<SortByName>(null);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category))
    );
    return uniqueCategories.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (sortByPrice) {
      filtered = [...filtered].sort((a, b) => {
        if (sortByPrice === "asc") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });
    }

    if (sortByName) {
      filtered = [...filtered].sort((a, b) => {
        const nameA = a.title.toLowerCase();
        const nameB = b.title.toLowerCase();
        if (sortByName === "asc") {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    }

    return filtered;
  }, [products, selectedCategory, sortByPrice, sortByName]);

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="category-filter" className="text-sm font-medium text-zinc-400">
              Categoria:
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
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-zinc-400">
              Preço:
            </label>
            <ToggleGroup
              type="single"
              value={sortByPrice || undefined}
              onValueChange={(value) => setSortByPrice(value as SortByPrice || null)}
              variant="outline"
            >
              <ToggleGroupItem value="asc" aria-label="Preço crescente" className="text-zinc-400">
                Menor
              </ToggleGroupItem>
              <ToggleGroupItem value="desc" aria-label="Preço decrescente" className="text-zinc-400">
                Maior
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-zinc-400">
              Nome:
            </label>
            <ToggleGroup
              type="single"
              value={sortByName || undefined}
              onValueChange={(value) => setSortByName(value as SortByName || null)}
              variant="outline"
            >
              <ToggleGroupItem value="asc" aria-label="Nome A-Z" className="text-zinc-400">
                A-Z
              </ToggleGroupItem>
              <ToggleGroupItem value="desc" aria-label="Nome Z-A" className="text-zinc-400">
                Z-A
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <span className="text-sm text-zinc-500 ml-auto">
            {filteredProducts.length} produto(s) encontrado(s)
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </>
  );
}

