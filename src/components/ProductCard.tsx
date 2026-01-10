"use client";

import { useState } from "react";
import Image from "next/image";
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
import Link from "next/link";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import type { ProductDetailProps } from "@/@types/products";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({
  id,
  title,
  price,
  category,
  image,
  rating,
}: ProductDetailProps) {
  const [quantity, setQuantity] = useState(0);

  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      console.log(`Adicionar ${quantity} unidades do produto ${id} ao carrinho`);
    }
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
      <CardFooter className="flex items-center justify-between pt-2">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-zinc-400">
            {formatPrice(price)}
          </span>
        </div>
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
      </CardFooter>
    </Card>
  );
}

