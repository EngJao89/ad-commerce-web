import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import * as toastModule from '@/lib/toast';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

const mockAdd = jest.fn();
const mockToggleFavorite = jest.fn();
const mockRequestLogin = jest.fn();

jest.mock('@/lib/toast', () => ({
  showToast: {
    success: jest.fn(),
    warning: jest.fn(),
  },
}));

jest.mock('@/contexts/CartContext', () => ({
  ...jest.requireActual('@/contexts/CartContext'),
  useCart: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: jest.fn(),
}));

jest.mock('@/contexts/FavoritesContext', () => ({
  ...jest.requireActual('@/contexts/FavoritesContext'),
  useFavorites: jest.fn(),
}));

jest.mock('@/components/ui/button', () => {
  const MockButton = ({
    children,
    onClick,
    disabled,
    className,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={className === 'w-full' ? undefined : disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
  return { Button: MockButton };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>
    <FavoritesProvider>{children}</FavoritesProvider>
  </CartProvider>
);

function setupProviders() {
  (useAuth as jest.Mock).mockReturnValue({
    isAuthenticated: true,
    requestLogin: mockRequestLogin,
  });
  (useCart as jest.Mock).mockImplementation(() => ({
    add: mockAdd,
  }));
  (useFavorites as jest.Mock).mockImplementation(() => ({
    toggle: mockToggleFavorite,
    isFavorite: jest.fn(() => false),
  }));
}

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
  beforeEach(() => {
    jest.clearAllMocks();
    setupProviders();
  });

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

  it('should build product with empty description when description is undefined', () => {
    const productWithoutDescription = {
      ...mockProduct,
      description: undefined,
    } as unknown as React.ComponentProps<typeof ProductCard>;
    render(<ProductCard {...productWithoutDescription} />, { wrapper });

    const quantityInput = screen.getByRole('spinbutton');
    fireEvent.change(quantityInput, { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(mockAdd).toHaveBeenCalledWith(
      expect.objectContaining({ description: '' }),
      1
    );
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
    const plusButton = buttons[2];
    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.click(plusButton);
    expect(quantityInput).toHaveValue(1);

    fireEvent.click(plusButton);
    expect(quantityInput).toHaveValue(2);
  });

  it('should decrease quantity when minus button is clicked', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });

    const buttons = screen.getAllByRole('button');
    const minusButton = buttons[1];
    const plusButton = buttons[2];
    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.click(plusButton);
    fireEvent.click(plusButton);
    expect(quantityInput).toHaveValue(2);

    fireEvent.click(minusButton);
    expect(quantityInput).toHaveValue(1);
  });

  it('should not decrease quantity below 0', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });

    const buttons = screen.getAllByRole('button');
    const minusButton = buttons[1];
    const quantityInput = screen.getByRole('spinbutton');

    expect(minusButton).toBeDisabled();
    expect(quantityInput).toHaveValue(0);

    fireEvent.click(minusButton);
    expect(quantityInput).toHaveValue(0);
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

  it('should set quantity to 0 when input is empty or invalid', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });

    const quantityInput = screen.getByRole('spinbutton');
    fireEvent.change(quantityInput, { target: { value: '5' } });
    expect(quantityInput).toHaveValue(5);

    fireEvent.change(quantityInput, { target: { value: '' } });
    expect(quantityInput).toHaveValue(0);
  });

  it('should show warning toast when adding to cart with quantity 0', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    expect(toastModule.showToast.warning).toHaveBeenCalledWith('Please select a quantity first');
    expect(mockAdd).not.toHaveBeenCalled();
  });

  it('should add to cart, show success toast and reset quantity when quantity is 1', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });

    const plusButton = screen.getAllByRole('button')[2];
    fireEvent.click(plusButton);

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    expect(mockAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        title: 'Test Product',
        price: 99.99,
        category: 'electronics',
      }),
      1
    );
    expect(toastModule.showToast.success).toHaveBeenCalledWith('1 item added to cart');
    expect(screen.getByRole('spinbutton')).toHaveValue(0);
  });

  it('should add to cart and show plural message when quantity is greater than 1', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });

    const quantityInput = screen.getByRole('spinbutton');
    fireEvent.change(quantityInput, { target: { value: '3' } });

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    expect(mockAdd).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, title: 'Test Product' }),
      3
    );
    expect(toastModule.showToast.success).toHaveBeenCalledWith('3 items added to cart');
    expect(screen.getByRole('spinbutton')).toHaveValue(0);
  });

  it('should add to favorites and show success toast when heart is clicked and not favorited', () => {
    render(<ProductCard {...mockProduct} />, { wrapper });

    const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalled();
    expect(toastModule.showToast.success).toHaveBeenCalledWith('Added to favorites');
  });

  it('should remove from favorites and show success toast when heart is clicked and already favorited', () => {
    (useFavorites as jest.Mock).mockImplementation(() => ({
      toggle: mockToggleFavorite,
      isFavorite: () => true,
    }));

    render(<ProductCard {...mockProduct} />, { wrapper });

    const favoriteButton = screen.getByRole('button', { name: /remove from favorites/i });
    fireEvent.click(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalled();
    expect(toastModule.showToast.success).toHaveBeenCalledWith('Removed from favorites');
  });

  it('should show login warning and call requestLogin when Add to cart clicked and not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      requestLogin: mockRequestLogin,
    });
    render(<ProductCard {...mockProduct} />, { wrapper });

    const iconButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('svg'));
    const plusButton = iconButtons[1];
    if (plusButton) fireEvent.click(plusButton);
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(toastModule.showToast.warning).toHaveBeenCalledWith('Faça login para adicionar ao carrinho.');
    expect(mockRequestLogin).toHaveBeenCalled();
    expect(mockAdd).not.toHaveBeenCalled();
  });

  it('should show login warning and call requestLogin when favorite clicked and not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      requestLogin: mockRequestLogin,
    });
    render(<ProductCard {...mockProduct} />, { wrapper });

    const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(favoriteButton);

    expect(toastModule.showToast.warning).toHaveBeenCalledWith('Faça login para favoritar.');
    expect(mockRequestLogin).toHaveBeenCalled();
    expect(mockToggleFavorite).not.toHaveBeenCalled();
  });
});
