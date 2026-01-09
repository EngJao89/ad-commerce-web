import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import type { ProductDetailProps } from "@/@types/products";

export default function ProductCard({
  id,
  title,
  price,
  category,
  image,
  rating,
}: ProductDetailProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <CardHeader className="p-0 relative">
        <div className="relative w-full h-64 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="capitalize">
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2 pt-4">
        <h3 className="font-semibold text-lg line-clamp-2 text-zinc-400 group-hover:text-zinc-500 transition-colors">
          {title}
        </h3>
        {rating && (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="font-medium">⭐ {rating.rate}</span>
            <span className="text-zinc-600">({rating.count})</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-2">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-zinc-400">${price}</span>
        </div>
        <Link
          href={`/products/${id}`}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors backdrop-blur-sm border border-white/10"
        >
          <ShoppingCart className="h-4 w-4 text-zinc-400" />
          <span className="text-sm font-medium text-zinc-400">Ver Detalhes</span>
        </Link>
      </CardFooter>
    </Card>
  );
}

