import ProductDetailClient from "@/components/ProductDetailClient";
import type { ProductDetailPageProps } from "@/@types/products";

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  return <ProductDetailClient productId={id} />;
}

