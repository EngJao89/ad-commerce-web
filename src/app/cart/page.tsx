import CartClient from "@/components/CartClient";
import RequireAuth from "@/components/RequireAuth";

export default function CartPage() {
  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">Cart</h1>
        <p className="text-zinc-400 mb-8">Review and manage your items.</p>
        <CartClient />
      </div>
    </RequireAuth>
  );
}
