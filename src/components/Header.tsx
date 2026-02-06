"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import CartPopover from "@/components/CartPopover";
import LoginPopover from "@/components/LoginPopover";

export default function Header() {
  const { items: favorites } = useFavorites();
  const favoritesCount = favorites.length;

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
          <CartPopover />
        </div>
        <div className="flex items-center gap-1">
          <LoginPopover />
        </div>
      </div>
    </header>
  );
}

