"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { Heart, LogOut, ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getUserById } from "@/lib/userApi";
import CartPopover from "@/components/CartPopover";
import LoginPopover from "@/components/LoginPopover";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { isAuthenticated, userId, logout, setOpenLogin } = useAuth();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || userId == null) return;
    let cancelled = false;
    getUserById(userId).then((user) => {
      if (!cancelled && user?.username) setUsername(user.username);
    });
    return () => {
      cancelled = true;
      setUsername(null);
    };
  }, [isAuthenticated, userId]);

  const displayName = isAuthenticated && userId != null ? (username ?? "…") : null;
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
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Badge
              variant="secondary"
              className="gap-1.5 border-white/20 bg-white/10 px-2.5 py-1 text-white hover:bg-white/20 [&>svg]:size-4"
            >
              <User className="size-4" />
              {displayName}
            </Badge>
          ) : (
            <LoginPopover
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-accent hover:text-accent-foreground"
                  aria-label="Login"
                  onClick={() => setOpenLogin(true)}
                >
                  <User className="h-5 w-5" />
                </Button>
              }
            />
          )}
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
          ) : null}
        </div>
      </div>
    </header>
  );
}

