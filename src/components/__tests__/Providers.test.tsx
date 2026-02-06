import { render, screen } from '@testing-library/react';
import Providers from '../Providers';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

function TestConsumer() {
  const cart = useCart();
  const favorites = useFavorites();
  return (
    <div>
      <span data-testid="cart-items">{cart?.items?.length ?? 'no-cart'}</span>
      <span data-testid="favorites-items">{favorites?.items?.length ?? 'no-favorites'}</span>
    </div>
  );
}

jest.mock('@/contexts/CartContext', () => ({
  CartProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="cart-provider">{children}</div>,
  useCart: jest.fn(),
}));

jest.mock('@/contexts/FavoritesContext', () => ({
  FavoritesProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="favorites-provider">{children}</div>,
  useFavorites: jest.fn(),
}));

describe('Providers', () => {
  it('should render children', () => {
    render(
      <Providers>
        <span>Child content</span>
      </Providers>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should wrap children with CartProvider then FavoritesProvider', () => {
    render(
      <Providers>
        <span>Inner</span>
      </Providers>
    );
    const cartProvider = screen.getByTestId('cart-provider');
    const favoritesProvider = screen.getByTestId('favorites-provider');
    expect(cartProvider).toBeInTheDocument();
    expect(favoritesProvider).toBeInTheDocument();
    expect(cartProvider).toContainElement(favoritesProvider);
    expect(favoritesProvider).toContainElement(screen.getByText('Inner'));
  });

  it('should provide CartContext and FavoritesContext to descendants', () => {
    (useCart as jest.Mock).mockReturnValue({ items: [], totalItems: 0, totalPrice: 0 });
    (useFavorites as jest.Mock).mockReturnValue({ items: [] });

    render(
      <Providers>
        <TestConsumer />
      </Providers>
    );

    expect(screen.getByTestId('cart-items')).toHaveTextContent('0');
    expect(screen.getByTestId('favorites-items')).toHaveTextContent('0');
  });
});
