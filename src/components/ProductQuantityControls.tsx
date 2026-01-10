"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { showToast } from "@/lib/toast";
import type { ProductQuantityControlsProps } from "@/@types/products";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProductQuantityControls({
  productId,
}: Readonly<ProductQuantityControlsProps>) {
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
      showToast.success(
        `${quantity} item${quantity > 1 ? 's' : ''} of product #${productId} added to cart successfully!`
      );
      setQuantity(0);
    } else {
      showToast.warning("Please select a quantity first");
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
    </div>
  );
}

