"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Heart, LogOut, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import CartPopover from "@/components/CartPopover";
import LoginPopover from "@/components/LoginPopover";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { isAuthenticated, logout, setOpenLogin } = useAuth();
  const { items: favorites } = useFavorites();
  const favoritesCount = favorites.length;
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("loginRequired") === "1") {
      setOpenLogin(true);
      router.replace("/");
    }
  }, [searchParams, setOpenLogin, router]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-md supports-backdrop-filter:bg-white/10 shadow-lg shadow-black/5">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-white">AD Commerce</span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Products
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            <Link
              href="/favorites"
              className="relative flex items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label={favoritesCount > 0 ? `Favorites, ${favoritesCount} items` : "Favorites"}
            >
              <Heart className="h-5 w-5 text-white hover:text-zinc-900" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {favoritesCount > 99 ? "99+" : favoritesCount}
                </span>
              )}
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-accent hover:text-accent-foreground"
              aria-label="Favorites"
              onClick={() => setOpenLogin(true)}
            >
              <Heart className="h-5 w-5" />
            </Button>
          )}
          {isAuthenticated ? (
            <CartPopover />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-accent hover:text-accent-foreground"
              aria-label="Cart"
              onClick={() => setOpenLogin(true)}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-accent hover:text-accent-foreground gap-2"
              onClick={logout}
              aria-label="Sair"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </Button>
          ) : (
            <LoginPopover />
          )}
        </div>
      </div>
    </header>
  );
}

