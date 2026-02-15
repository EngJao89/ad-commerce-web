"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import { showToast } from "@/lib/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import type { ProductQuantityControlsProps } from "@/@types/products";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProductQuantityControls({
  productId,
  product,
}: Readonly<ProductQuantityControlsProps>) {
  const [quantity, setQuantity] = useState(0);
  const { isAuthenticated, requestLogin } = useAuth();
  const { add } = useCart();

  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      showToast.warning("Faça login para adicionar ao carrinho.");
      requestLogin();
      return;
    }
    if (quantity <= 0) {
      showToast.warning("Please select a quantity first");
      return;
    }
    if (product) {
      add(product, quantity);
      showToast.success(
        `${quantity} item${quantity > 1 ? "s" : ""} added to cart`
      );
      setQuantity(0);
    } else {
      showToast.success(
        `${quantity} item${quantity > 1 ? "s" : ""} of product #${productId} added to cart successfully!`
      );
      setQuantity(0);
    }
  };

  return (
    <div className="flex flex-col gap-4">
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
          className="w-20 text-center text-zinc-400"
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
      <Button
        onClick={handleAddToCart}
        disabled={quantity === 0}
        className="w-full sm:w-auto"
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Add to cart
      </Button>
    </div>
  );
}

