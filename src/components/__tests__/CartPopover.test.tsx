import { render, screen, fireEvent } from '@testing-library/react';
import CartPopover from '../CartPopover';
import { useCart } from '@/contexts/CartContext';
import type { CartItem } from '@/@types/cart';
import type { Product } from '@/@types/products';

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

function openPopover() {
  const trigger = screen.getByRole('button', { name: /cart/i });
  fireEvent.click(trigger);
}

describe('CartPopover', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('trigger button', () => {
    it('should render cart trigger with aria-label Cart when empty', () => {
      (useCart as jest.Mock).mockReturnValue({
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });

      render(<CartPopover />);

      expect(screen.getByRole('button', { name: 'Cart' })).toBeInTheDocument();
    });

    it('should render cart trigger with item count when cart has items', () => {
      (useCart as jest.Mock).mockReturnValue({
        items: mockCartItems,
        totalItems: 2,
        totalPrice: 199.98,
      });

      render(<CartPopover />);

      expect(screen.getByRole('button', { name: /cart,\s*2\s*items/i })).toBeInTheDocument();
    });

    it('should show badge with 99+ when totalItems exceeds 99', () => {
      (useCart as jest.Mock).mockReturnValue({
        items: [],
        totalItems: 100,
        totalPrice: 0,
      });

      render(<CartPopover />);

      expect(screen.getByText('99+')).toBeInTheDocument();
    });
  });

  describe('popover content when empty', () => {
    beforeEach(() => {
      (useCart as jest.Mock).mockReturnValue({
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });
    });

    it('should show empty state when popover is opened', () => {
      render(<CartPopover />);
      openPopover();

      expect(screen.getByText('Carrinho')).toBeInTheDocument();
      expect(screen.getByText('0 itens')).toBeInTheDocument();
      expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument();
    });
  });

  describe('popover content with items', () => {
    beforeEach(() => {
      (useCart as jest.Mock).mockReturnValue({
        items: mockCartItems,
        totalItems: 2,
        totalPrice: 199.98,
      });
    });

    it('should show header with item count when popover is opened', () => {
      render(<CartPopover />);
      openPopover();

      expect(screen.getByText('Carrinho')).toBeInTheDocument();
      expect(screen.getByText('2 itens')).toBeInTheDocument();
    });

    it('should show product title and price in list', () => {
      render(<CartPopover />);
      openPopover();

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText(/2x\s*R\$\s*99,99/)).toBeInTheDocument();
      const subtotalElements = screen.getAllByText(/R\$\s*199,98/);
      expect(subtotalElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should show total and Ver carrinho link', () => {
      render(<CartPopover />);
      openPopover();

      expect(screen.getByText('Total')).toBeInTheDocument();
      const totalPriceElements = screen.getAllByText(/R\$\s*199,98/);
      expect(totalPriceElements.length).toBeGreaterThanOrEqual(1);

      const verCarrinhoLink = screen.getByRole('link', { name: /ver carrinho/i });
      expect(verCarrinhoLink).toBeInTheDocument();
      expect(verCarrinhoLink).toHaveAttribute('href', '/cart');
    });

    it('should show singular "item" when totalItems is 1', () => {
      (useCart as jest.Mock).mockReturnValue({
        items: [{ product: mockProduct, quantity: 1 }],
        totalItems: 1,
        totalPrice: 99.99,
      });

      render(<CartPopover />);
      openPopover();

      expect(screen.getByText('1 item')).toBeInTheDocument();
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
        totalItems: 4,
        totalPrice: 189.96,
      });
    });

    it('should list all cart items when popover is opened', () => {
      render(<CartPopover />);
      openPopover();

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Second Product')).toBeInTheDocument();
    });

    it('should display correct total for multiple items', () => {
      render(<CartPopover />);
      openPopover();

      const totalElements = screen.getAllByText(/R\$\s*189,96/);
      expect(totalElements.length).toBeGreaterThan(0);
    });
  });
});
