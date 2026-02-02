import EmptyState from "@/components/EmptyState";

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-2">Cart</h1>
      <p className="text-zinc-400 mb-8">Review and manage your items.</p>
      <EmptyState
        title="Your cart is empty"
        message="You haven't added any items yet. Browse our products and add something you like!"
        actionLabel="Continue shopping"
        actionHref="/"
      />
    </div>
  );
}
