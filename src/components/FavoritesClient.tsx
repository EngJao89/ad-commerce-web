"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { useFavorites } from "@/contexts/FavoritesContext";
import { formatPrice } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import EmptyState from "@/components/EmptyState";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FavoritesClient() {
  const { items, remove } = useFavorites();

  if (items.length === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        message="Save products you like by clicking the heart on any product card."
        actionLabel="Browse products"
        actionHref="/"
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((product) => (
        <Card
          key={product.id}
          className="group overflow-hidden flex flex-col border-zinc-700 bg-zinc-800/50 hover:shadow-lg transition-all duration-300"
        >
          <CardHeader className="p-0 relative">
            <Link href={`/detail/${product.id}`} className="block">
              <div className="relative w-full h-56 bg-zinc-900">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              </div>
            </Link>
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="capitalize">
                {product.category}
              </Badge>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 dark:bg-zinc-800/90 hover:bg-red-500/20 shadow-md"
              onClick={() => {
                remove(product.id);
                showToast.success("Removed from favorites");
              }}
              aria-label="Remove from favorites"
            >
              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-2 pt-4">
            <Link href={`/detail/${product.id}`}>
              <h3 className="font-semibold text-lg line-clamp-2 text-zinc-300 hover:text-white transition-colors">
                {product.title}
              </h3>
            </Link>
            {product.rating && (
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="font-medium">⭐ {product.rating.rate}</span>
                <span className="text-zinc-600">({product.rating.count})</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2">
            <span className="text-xl font-bold text-white">
              {formatPrice(product.price)}
            </span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
