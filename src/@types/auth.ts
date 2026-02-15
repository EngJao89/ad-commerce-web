export type AuthContextValue = {
  token: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  login: (token: string, userId?: number) => void;
  logout: () => void;
  openLogin: boolean;
  setOpenLogin: (open: boolean) => void;
  requestLogin: () => void;
};
