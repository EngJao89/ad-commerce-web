"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import EmptyState from "@/components/EmptyState";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function CartClient() {
  const { items, remove, updateQuantity, clear, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="You haven't added any items yet. Browse our products and add something you like!"
        actionLabel="Continue shopping"
        actionHref="/"
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map(({ product, quantity }) => (
          <Card
            key={product.id}
            className="overflow-hidden flex flex-col border-zinc-700 bg-zinc-800/50"
          >
            <CardHeader className="p-0">
              <Link href={`/detail/${product.id}`} className="block">
                <div className="relative w-full h-48 bg-zinc-900">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Link>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-2 pt-4">
              <Link href={`/detail/${product.id}`}>
                <h3 className="font-semibold text-lg line-clamp-2 text-zinc-300 hover:text-white transition-colors">
                  {product.title}
                </h3>
              </Link>
              <p className="text-zinc-400 font-medium">
                {formatPrice(product.price)} each
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-zinc-500">Quantity</span>
                <ButtonGroup>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      updateQuantity(product.id, Math.max(0, quantity - 1))
                    }
                    disabled={quantity <= 1}
                    className="text-zinc-400"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value) || 0;
                      updateQuantity(product.id, Math.max(1, value));
                    }}
                    min={1}
                    className="w-14 text-center text-zinc-400"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="text-zinc-400"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </ButtonGroup>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="text-lg font-bold text-white">
                  Subtotal: {formatPrice(product.price * quantity)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(product.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  aria-label="Remove from cart"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Separator className="bg-zinc-700" />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-xl border border-zinc-700 bg-zinc-800/50 p-6">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-white">
            Total: {formatPrice(totalPrice)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={clear}
            className="text-zinc-400 border-zinc-600 hover:bg-zinc-700"
          >
            Clear cart
          </Button>
        </div>
        <Button asChild>
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
