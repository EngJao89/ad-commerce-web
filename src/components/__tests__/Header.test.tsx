import { render, screen } from '@testing-library/react';
import Header from '../Header';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>
    <FavoritesProvider>{children}</FavoritesProvider>
  </CartProvider>
);

describe('Header', () => {
  it('should render the logo with correct text', () => {
    render(<Header />, { wrapper });
    
    const logo = screen.getByText('AD Commerce');
    expect(logo).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<Header />, { wrapper });
    
    expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument();
  });

  it('should render shopping cart link', () => {
    render(<Header />, { wrapper });
    
    const cartLink = screen.getByRole('link', { name: /shopping cart/i });
    expect(cartLink).toBeInTheDocument();
    expect(cartLink).toHaveAttribute('href', '/cart');
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
});
