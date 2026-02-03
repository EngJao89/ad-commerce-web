"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function CartPopover() {
  const { items, totalItems, totalPrice } = useCart();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white hover:bg-accent hover:text-accent-foreground"
          aria-label={totalItems > 0 ? `Cart, ${totalItems} items` : "Cart"}
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="border-b px-4 py-3">
          <h3 className="font-semibold text-sm text-foreground">Carrinho</h3>
          <p className="text-xs text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "itens"}
          </p>
        </div>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Seu carrinho está vazio
            </p>
          </div>
        ) : (
          <>
            <div className="max-h-[320px] overflow-y-auto">
              <ul className="space-y-0 divide-y">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex gap-3 px-4 py-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-1"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-foreground">
                        {product.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {quantity}x {formatPrice(product.price)}
                      </p>
                      <p className="text-xs font-medium text-foreground">
                        {formatPrice(product.price * quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">{formatPrice(totalPrice)}</span>
              </div>
              <Button asChild className="w-full" size="sm">
                <Link href="/cart">Ver carrinho</Link>
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
