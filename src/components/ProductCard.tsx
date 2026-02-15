"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import type { ProductDetailProps, Product } from "@/@types/products";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProductCard({
  id,
  title,
  price,
  description,
  category,
  image,
  rating,
}: Readonly<ProductDetailProps>) {
  const [quantity, setQuantity] = useState(0);
  const { isAuthenticated, requestLogin } = useAuth();
  const { add } = useCart();
  const { toggle: toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(id);

  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const product: Product = {
    id,
    title,
    price,
    description: description ?? "",
    category,
    image,
    rating,
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      showToast.warning("Faça login para adicionar ao carrinho.");
      requestLogin();
      return;
    }
    if (quantity > 0) {
      add(product, quantity);
      showToast.success(
        `${quantity} item${quantity > 1 ? "s" : ""} added to cart`
      );
      setQuantity(0);
    } else {
      showToast.warning("Please select a quantity first");
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast.warning("Faça login para favoritar.");
      requestLogin();
      return;
    }
    toggleFavorite(product);
    showToast.success(favorited ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <CardHeader className="p-0 relative">
        <Link href={`/detail/${id}`} className="block">
          <div className="relative w-full h-64 overflow-hidden bg-zinc-100 dark:bg-zinc-900 cursor-pointer">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="capitalize">
            {category}
          </Badge>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-700 shadow-md"
          onClick={handleToggleFavorite}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-5 w-5 ${favorited ? "fill-red-500 text-red-500" : "text-zinc-600"}`}
          />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2 pt-4">
        <Link href={`/detail/${id}`}>
          <h3 className="font-semibold text-lg line-clamp-2 text-zinc-400 group-hover:text-zinc-500 transition-colors cursor-pointer hover:text-white">
            {title}
          </h3>
        </Link>
        {rating && (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="font-medium">⭐ {rating.rate}</span>
            <span className="text-zinc-600">({rating.count})</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between w-full">
          <span className="text-2xl font-bold text-zinc-400">
            {formatPrice(price)}
          </span>
          <ButtonGroup>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrease}
              disabled={quantity === 0}
              className="text-zinc-400"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value) || 0;
                setQuantity(Math.max(0, value));
              }}
              min={0}
              className="w-16 text-center text-zinc-400"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrease}
              className="text-zinc-400"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </ButtonGroup>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={quantity === 0}
          className="w-full"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}

