export type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  openLogin: boolean;
  setOpenLogin: (open: boolean) => void;
  requestLogin: () => void;
};
