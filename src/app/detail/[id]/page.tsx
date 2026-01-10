import Image from "next/image";
import { notFound } from "next/navigation";
import api from "@/lib/axios";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import ProductQuantityControls from "@/components/ProductQuantityControls";
import type { Product, ProductDetailPageProps } from "@/@types/products";

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  
  let product: Product;
  try {
    const response = await api.get<Product>(`products/${id}`);
    product = response.data;
  } catch {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative w-full h-[500px] lg:h-[600px] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-8"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <Badge variant="secondary" className="capitalize mb-4">
              {product.category}
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {product.title}
            </h1>
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold text-zinc-300">
                    {product.rating.rate}
                  </span>
                </div>
                <span className="text-zinc-500">
                  ({product.rating.count} ratings)
                </span>
              </div>
            )}
          </div>

          <Separator className="bg-zinc-700" />

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Price</h2>
            <p className="text-4xl font-bold text-zinc-400">
              {formatPrice(product.price)}
            </p>
          </div>

          <Separator className="bg-zinc-700" />

          <div>
            <h2 className="text-xl font-semibold text-white mb-3">
              Description
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          <Separator className="bg-zinc-700" />

          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium text-zinc-400">
              Quantity
            </label>
            <ProductQuantityControls productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

