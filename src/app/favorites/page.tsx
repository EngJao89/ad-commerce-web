import FavoritesClient from "@/components/FavoritesClient";
import RequireAuth from "@/components/RequireAuth";

export default function FavoritesPage() {
  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">Favorites</h1>
        <p className="text-zinc-400 mb-8">Your favorite products.</p>
        <FavoritesClient />
      </div>
    </RequireAuth>
  );
}
