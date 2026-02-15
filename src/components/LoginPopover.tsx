"use client";

import { useState, useEffect } from "react";
import { LogIn } from "lucide-react";

import { AxiosError } from "axios";
import api from "@/lib/axios";
import { showToast, showApiError } from "@/lib/toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const AUTH_LOGIN_ENDPOINT = "/auth/login";

export default function LoginPopover() {
  const { login: authLogin, openLogin, setOpenLogin } = useAuth();
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (openLogin) {
      setOpen(true);
      setOpenLogin(false);
    }
  }, [openLogin, setOpenLogin]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setOpenLogin(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login.trim() || !password) {
      showToast.warning("Preencha email ou usuário e senha.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post<{ token: string }>(
        AUTH_LOGIN_ENDPOINT,
        { username: login.trim(), password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (data?.token) {
        authLogin(data.token);
        showToast.success("Login realizado com sucesso!");
        setLogin("");
        setPassword("");
        setOpen(false);
      } else {
        showToast.error("Resposta inválida do servidor.");
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        showToast.error("Usuário ou senha incorretos.");
      } else {
        showApiError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-accent hover:text-accent-foreground gap-2"
          aria-label="Login"
        >
          <LogIn className="h-5 w-5" />
          Login
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0" align="end" sideOffset={8}>
        <Card className="border-0 shadow-none gap-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Entrar</CardTitle>
            <CardDescription>
              Use seu email ou usuário e senha para acessar.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="flex flex-col gap-3 pt-0">
              <div className="space-y-2">
                <label
                  htmlFor="login-identifier"
                  className="text-sm font-medium leading-none"
                >
                  Email ou usuário
                </label>
                <Input
                  id="login-identifier"
                  type="text"
                  placeholder="seu email ou usuário"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  autoComplete="username"
                  disabled={loading}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="login-password"
                  className="text-sm font-medium leading-none"
                >
                  Senha
                </label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                  className="bg-background"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col mt-4 gap-2 pt-0">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando…" : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
