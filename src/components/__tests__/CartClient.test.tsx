import { render, screen, fireEvent } from '@testing-library/react';
import CartClient from '../CartClient';
import { useCart } from '@/contexts/CartContext';
import type { CartItem } from '@/@types/cart';
import type { Product } from '@/@types/products';

const mockRemove = jest.fn();
const mockUpdateQuantity = jest.fn();
const mockClear = jest.fn();

jest.mock('@/contexts/CartContext', () => ({
  useCart: jest.fn(),
}));

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  category: 'electronics',
  description: 'Test description',
  image: 'https://example.com/image.jpg',
  rating: { rate: 4.5, count: 100 },
};

const mockCartItems: CartItem[] = [
  { product: mockProduct, quantity: 2 },
];

describe('CartClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('empty cart', () => {
    beforeEach(() => {
      (useCart as jest.Mock).mockReturnValue({
        items: [],
        remove: mockRemove,
        updateQuantity: mockUpdateQuantity,
        clear: mockClear,
        totalPrice: 0,
      });
    });

    it('should render empty state when cart has no items', () => {
      render(<CartClient />);

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      expect(screen.getByText(/You haven't added any items yet/)).toBeInTheDocument();
    });

    it('should render Continue shopping link pointing to home', () => {
      render(<CartClient />);

      const link = screen.getByRole('link', { name: /continue shopping/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });
  });

  describe('cart with items', () => {
    beforeEach(() => {
      (useCart as jest.Mock).mockReturnValue({
        items: mockCartItems,
        remove: mockRemove,
        updateQuantity: mockUpdateQuantity,
        clear: mockClear,
        totalPrice: 199.98,
      });
    });

    it('should render product card with title and price', () => {
      render(<CartClient />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText(/R\$\s*99,99\s*each/)).toBeInTheDocument();
    });

    it('should render quantity controls', () => {
      render(<CartClient />);

      expect(screen.getByText('Quantity')).toBeInTheDocument();
      const quantityInput = screen.getByRole('spinbutton');
      expect(quantityInput).toHaveValue(2);
    });

    it('should render subtotal for item', () => {
      render(<CartClient />);

      expect(screen.getByText(/Subtotal:\s*R\$\s*199,98/)).toBeInTheDocument();
    });

    it('should render total and Clear cart button', () => {
      render(<CartClient />);

      expect(screen.getByText(/Total:\s*R\$\s*199,98/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /clear cart/i })).toBeInTheDocument();
    });

    it('should render Continue shopping link', () => {
      render(<CartClient />);

      const link = screen.getByRole('link', { name: /continue shopping/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });

    it('should render link to product detail', () => {
      render(<CartClient />);

      const detailLinks = screen.getAllByRole('link', { name: /test product/i });
      expect(detailLinks.length).toBeGreaterThan(0);
      expect(detailLinks[0]).toHaveAttribute('href', '/detail/1');
    });

    it('should call remove when Remove from cart button is clicked', () => {
      render(<CartClient />);

      const removeButton = screen.getByRole('button', { name: /remove from cart/i });
      fireEvent.click(removeButton);

      expect(mockRemove).toHaveBeenCalledTimes(1);
      expect(mockRemove).toHaveBeenCalledWith(1);
    });

    it('should call updateQuantity when plus button is clicked', () => {
      render(<CartClient />);

      const buttons = screen.getAllByRole('button');
      const isQuantityButton = (b: HTMLElement) =>
        b.getAttribute('aria-label') !== 'Remove from cart' && !b.textContent?.includes('Clear cart');
      const minusIdx = buttons.findIndex(isQuantityButton);
      const plusButton = buttons[minusIdx + 1];
      fireEvent.click(plusButton);
      expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 3);
    });

    it('should call updateQuantity when minus button is clicked', () => {
      render(<CartClient />);

      const buttons = screen.getAllByRole('button');
      const isQuantityButton = (b: HTMLElement) =>
        b.getAttribute('aria-label') !== 'Remove from cart' && !b.textContent?.includes('Clear cart');
      const minusButton = buttons.find(isQuantityButton);
      fireEvent.click(minusButton!);
      expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 1);
    });

    it('should call clear when Clear cart button is clicked', () => {
      render(<CartClient />);

      const clearButton = screen.getByRole('button', { name: /clear cart/i });
      fireEvent.click(clearButton);

      expect(mockClear).toHaveBeenCalledTimes(1);
    });

    it('should call updateQuantity when quantity input changes', () => {
      render(<CartClient />);

      const quantityInput = screen.getByRole('spinbutton');
      fireEvent.change(quantityInput, { target: { value: '5' } });

      expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 5);
    });
  });

  describe('multiple items', () => {
    const secondProduct: Product = {
      id: 2,
      title: 'Second Product',
      price: 29.99,
      category: 'clothing',
      description: 'Second desc',
      image: 'https://example.com/image2.jpg',
    };

    beforeEach(() => {
      (useCart as jest.Mock).mockReturnValue({
        items: [
          { product: mockProduct, quantity: 1 },
          { product: secondProduct, quantity: 3 },
        ],
        remove: mockRemove,
        updateQuantity: mockUpdateQuantity,
        clear: mockClear,
        totalPrice: 189.96,
      });
    });

    it('should render all cart items', () => {
      render(<CartClient />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Second Product')).toBeInTheDocument();
    });

    it('should display correct total', () => {
      render(<CartClient />);

      expect(screen.getByText(/Total:\s*R\$\s*189,96/)).toBeInTheDocument();
    });
  });
});
