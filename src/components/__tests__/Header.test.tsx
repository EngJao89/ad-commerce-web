import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '../Header';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { getUserById } from '@/lib/userApi';

const mockLogout = jest.fn();
const mockSetOpenLogin = jest.fn();
const mockReplace = jest.fn();
const mockGet = jest.fn();

jest.mock('@/contexts/AuthContext', () => ({
  ...jest.requireActual('@/contexts/AuthContext'),
  useAuth: jest.fn(),
}));

jest.mock('@/contexts/FavoritesContext', () => ({
  ...jest.requireActual('@/contexts/FavoritesContext'),
  useFavorites: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: mockGet }),
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@/lib/userApi', () => ({
  getUserById: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <CartProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </CartProvider>
  </AuthProvider>
);

function setAuth(overrides: Partial<ReturnType<typeof useAuth>>) {
  (useAuth as jest.Mock).mockImplementation(() => ({
    isAuthenticated: false,
    userId: null,
    logout: mockLogout,
    setOpenLogin: mockSetOpenLogin,
    token: null,
    ...overrides,
  }));
}

function setFavorites(items: { id: number }[] = []) {
  (useFavorites as jest.Mock).mockImplementation(() => ({
    items,
    add: jest.fn(),
    remove: jest.fn(),
    toggle: jest.fn(),
    isFavorite: jest.fn(() => false),
  }));
}

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReturnValue(null);
    setAuth({});
    setFavorites([]);
  });

  it('should render the logo with correct text', () => {
    render(<Header />, { wrapper });
    const logo = screen.getByText('AD Commerce');
    expect(logo).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<Header />, { wrapper });
    expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument();
  });

  it('should render cart popover trigger', () => {
    render(<Header />, { wrapper });
    const cartButton = screen.getByRole('button', { name: /cart/i });
    expect(cartButton).toBeInTheDocument();
  });

  it('should have correct href for products link', () => {
    render(<Header />, { wrapper });
    expect(screen.getByRole('link', { name: /products/i })).toHaveAttribute('href', '/');
  });

  it('should have logo link pointing to home', () => {
    render(<Header />, { wrapper });
    const logoLink = screen.getByText('AD Commerce').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  describe('when unauthenticated', () => {
    it('should show Favorites button that opens login on click', () => {
      render(<Header />, { wrapper });
      fireEvent.click(screen.getByRole('button', { name: /favorites/i }));
      expect(mockSetOpenLogin).toHaveBeenCalledWith(true);
    });

    it('should show Cart button that opens login on click', () => {
      render(<Header />, { wrapper });
      fireEvent.click(screen.getByRole('button', { name: /cart/i }));
      expect(mockSetOpenLogin).toHaveBeenCalledWith(true);
    });
  });

  describe('when authenticated', () => {
    beforeEach(() => {
      setAuth({
        isAuthenticated: true,
        userId: 1,
        token: 'fake-token',
        logout: mockLogout,
        setOpenLogin: mockSetOpenLogin,
      });
    });

    it('should fetch username and show it in badge', async () => {
      (getUserById as jest.Mock).mockResolvedValue({ id: 1, username: 'johnd' });
      render(<Header />, { wrapper });
      await waitFor(() => {
        expect(screen.getByText('johnd')).toBeInTheDocument();
      });
      expect(getUserById).toHaveBeenCalledWith(1);
    });

    it('should show loading placeholder in badge until username loads', () => {
      (getUserById as jest.Mock).mockImplementation(() => new Promise(() => {}));
      render(<Header />, { wrapper });
      expect(screen.getByText('…')).toBeInTheDocument();
    });

    it('should show placeholder when getUserById returns null', async () => {
      (getUserById as jest.Mock).mockResolvedValue(null);
      render(<Header />, { wrapper });
      await waitFor(() => {
        expect(screen.getByText('…')).toBeInTheDocument();
      });
    });

    it('should render favorites link when authenticated', () => {
      (getUserById as jest.Mock).mockResolvedValue({ id: 1, username: 'johnd' });
      render(<Header />, { wrapper });
      const favLink = screen.getByRole('link', { name: /favorites/i });
      expect(favLink).toBeInTheDocument();
      expect(favLink).toHaveAttribute('href', '/favorites');
    });

    it('should show favorites count badge when has items', async () => {
      setFavorites([{ id: 1 }, { id: 2 }]);
      (getUserById as jest.Mock).mockResolvedValue({ id: 1, username: 'johnd' });
      render(<Header />, { wrapper });
      await waitFor(() => {
        expect(screen.getByText('johnd')).toBeInTheDocument();
      });
      const favLink = screen.getByRole('link', { name: /favorites, 2 items/i });
      expect(favLink).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should show 99+ in favorites badge when count exceeds 99', async () => {
      setFavorites(Array(100).fill(null).map((_, i) => ({ id: i + 1 })));
      (getUserById as jest.Mock).mockResolvedValue({ id: 1, username: 'johnd' });
      render(<Header />, { wrapper });
      await waitFor(() => {
        expect(screen.getByText('johnd')).toBeInTheDocument();
      });
      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    it('should render CartPopover when authenticated', () => {
      (getUserById as jest.Mock).mockResolvedValue({ id: 1, username: 'johnd' });
      render(<Header />, { wrapper });
      const cartButton = screen.getByRole('button', { name: /cart/i });
      expect(cartButton).toBeInTheDocument();
    });

    it('should show logout button and call logout on click', async () => {
      (getUserById as jest.Mock).mockResolvedValue({ id: 1, username: 'johnd' });
      render(<Header />, { wrapper });
      await waitFor(() => {
        expect(screen.getByText('johnd')).toBeInTheDocument();
      });
      const logoutBtn = screen.getByRole('button', { name: /sair/i });
      expect(logoutBtn).toBeInTheDocument();
      fireEvent.click(logoutBtn);
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe('loginRequired query param', () => {
    it('should call setOpenLogin and router.replace when loginRequired=1', () => {
      mockGet.mockImplementation((key: string) => (key === 'loginRequired' ? '1' : null));
      render(<Header />, { wrapper });
      expect(mockSetOpenLogin).toHaveBeenCalledWith(true);
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });
});
