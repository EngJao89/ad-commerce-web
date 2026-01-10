"use client";

import { useState } from "react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Minus, Plus } from "lucide-react";

interface ProductQuantityControlsProps {
  productId: number;
}

export default function ProductQuantityControls({
  productId,
}: ProductQuantityControlsProps) {
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
      console.log(`Adicionar ${quantity} unidades do produto ${productId} ao carrinho`);
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

