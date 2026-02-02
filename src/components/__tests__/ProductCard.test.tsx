import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';
import { CartProvider } from '@/contexts/CartContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  category: 'electronics',
  description: 'Test product description',
  image: 'https://example.com/image.jpg',
  rating: {
    rate: 4.5,
    count: 100,
  },
};

describe('ProductCard', () => {
  it('should render product information', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/electronics/i)).toBeInTheDocument();
  });

  it('should render product price', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });
    
    const priceElement = screen.getByText(/R\$/);
    expect(priceElement).toBeInTheDocument();
  });

  it('should render rating when provided', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });

    expect(screen.getByText(/4\.5/)).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('should not render rating when not provided', () => {
    const productWithoutRating = { ...mockProduct, rating: undefined };
    render(<ProductCard {...productWithoutRating} />, { wrapper });

    expect(screen.queryByText(/⭐/)).not.toBeInTheDocument();
  });

  it('should have link to product detail page', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });

    const detailLinks = screen.getAllByRole('link');
    const productDetailLink = detailLinks.find(link => link.getAttribute('href') === '/detail/1');
    expect(productDetailLink).toBeDefined();
  });

  it('should initialize quantity as 0', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });

    const quantityInput = screen.getByRole('spinbutton');
    expect(quantityInput).toHaveValue(0);
  });

  it('should increase quantity when plus button is clicked', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });

    const buttons = screen.getAllByRole('button');
    const plusButton = buttons.find(btn => btn.querySelector('svg')?.getAttribute('data-lucide') === 'plus' || btn.innerHTML.includes('Plus'));
    const quantityInput = screen.getByRole('spinbutton');

    if (plusButton) {
      fireEvent.click(plusButton);
      expect(quantityInput).toHaveValue(1);

      fireEvent.click(plusButton);
      expect(quantityInput).toHaveValue(2);
    } else {
      const iconButtons = buttons.filter(btn => btn.querySelector('svg'));
      if (iconButtons.length >= 2) {
        fireEvent.click(iconButtons[1]);
        expect(quantityInput).toHaveValue(1);
      }
    }
  });

  it('should decrease quantity when minus button is clicked', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });

    const buttons = screen.getAllByRole('button');
    const quantityInput = screen.getByRole('spinbutton');

    const iconButtons = buttons.filter(btn => btn.querySelector('svg') && !btn.textContent?.includes('Add'));

    if (iconButtons.length >= 2) {
      const plusButton = iconButtons[1];
      const minusButton = iconButtons[0];

      fireEvent.click(plusButton);
      fireEvent.click(plusButton);
      expect(quantityInput).toHaveValue(2);

      fireEvent.click(minusButton);
      expect(quantityInput).toHaveValue(1);
    }
  });

  it('should not decrease quantity below 0', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });

    const buttons = screen.getAllByRole('button');
    const quantityInput = screen.getByRole('spinbutton');

    const iconButtons = buttons.filter(btn => btn.querySelector('svg') && !btn.textContent?.includes('Add'));
    const minusButton = iconButtons[0];

    if (minusButton) {
      expect(minusButton).toBeDisabled();
      expect(quantityInput).toHaveValue(0);

      fireEvent.click(minusButton);
      expect(quantityInput).toHaveValue(0);
    }
  });

  it('should update quantity when input value changes', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });

    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: '5' } });
    expect(quantityInput).toHaveValue(5);
  });

  it('should not allow negative quantity in input', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });

    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: '-5' } });
    expect(quantityInput).toHaveValue(0);
  });
});
