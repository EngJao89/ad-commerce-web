"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { showToast } from "@/lib/toast";

type RequireAuthProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, requestLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) return;
    showToast.warning("Faça login para acessar esta página.");
    requestLogin();
    router.replace("/?loginRequired=1");
  }, [isAuthenticated, requestLogin, router]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-zinc-400 mb-4">
          Redirecionando para fazer login...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
