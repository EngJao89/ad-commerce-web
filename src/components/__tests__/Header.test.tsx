import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header', () => {
  it('should render the logo with correct text', () => {
    render(<Header />);
    
    const logo = screen.getByText('AD Commerce');
    expect(logo).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<Header />);
    
    expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('should render shopping cart link', () => {
    render(<Header />);
    
    const links = screen.getAllByRole('link');
    const cartLink = links.find(link => link.getAttribute('href') === '/cart');
    expect(cartLink).toBeInTheDocument();
    if (cartLink) {
      expect(cartLink).toHaveAttribute('aria-label', 'Shopping cart');
    }
  });

  it('should have correct hrefs for navigation links', () => {
    render(<Header />);
    
    expect(screen.getByRole('link', { name: /products/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact');
  });

  it('should have logo link pointing to home', () => {
    render(<Header />);
    
    const logoLink = screen.getByText('AD Commerce').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });
});
