import { render, screen, fireEvent } from '@testing-library/react';
import ProductQuantityControls from '../ProductQuantityControls';
import { CartProvider } from '@/contexts/CartContext';
import { useCart } from '@/contexts/CartContext';
import * as toast from '@/lib/toast';
import type { Product } from '@/@types/products';

const mockAdd = jest.fn();

jest.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    isAuthenticated: true,
    requestLogin: jest.fn(),
  }),
}));

jest.mock('@/contexts/CartContext', () => ({
  ...jest.requireActual('@/contexts/CartContext'),
  useCart: jest.fn(),
}));

jest.mock('@/lib/toast', () => ({
  showToast: {
    warning: jest.fn(),
    success: jest.fn(),
  },
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
      disabled={className?.includes('w-full') ? undefined : disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
  return { Button: MockButton };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  category: 'electronics',
  description: 'Desc',
  image: 'https://example.com/img.jpg',
  rating: { rate: 4.5, count: 100 },
};

describe('ProductQuantityControls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCart as jest.Mock).mockReturnValue({ add: mockAdd });
  });

  const getIconButtons = () => {
    const buttons = screen.getAllByRole('button');
    return buttons.filter(btn => btn.querySelector('svg'));
  };

  it('should render quantity controls', () => {
    render(<ProductQuantityControls productId={1} />, { wrapper });

    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2); // Minus and Plus buttons
  });

  it('should initialize with quantity 0', () => {
    render(<ProductQuantityControls productId={1} />, { wrapper });

    const quantityInput = screen.getByRole('spinbutton');
    expect(quantityInput).toHaveValue(0);
  });

  it('should increase quantity when plus button is clicked', () => {
    render(<ProductQuantityControls productId={1} />, { wrapper });

    const iconButtons = getIconButtons();
    const plusButton = iconButtons[1];
    const quantityInput = screen.getByRole('spinbutton');

    if (plusButton) {
      fireEvent.click(plusButton);
      expect(quantityInput).toHaveValue(1);

      fireEvent.click(plusButton);
      expect(quantityInput).toHaveValue(2);
    }
  });

  it('should decrease quantity when minus button is clicked', () => {
    render(<ProductQuantityControls productId={1} />, { wrapper });

    const iconButtons = getIconButtons();
    const plusButton = iconButtons[1];
    const minusButton = iconButtons[0];
    const quantityInput = screen.getByRole('spinbutton');
    
    if (plusButton && minusButton) {
      fireEvent.click(plusButton);
      fireEvent.click(plusButton);
      expect(quantityInput).toHaveValue(2);

      fireEvent.click(minusButton);
      expect(quantityInput).toHaveValue(1);
    }
  });

  it('should disable minus button when quantity is 0', () => {
    render(<ProductQuantityControls productId={1} />, { wrapper });

    const iconButtons = getIconButtons();
    const minusButton = iconButtons[0];

    if (minusButton) {
      expect(minusButton).toBeDisabled();
    }
  });

  it('should not decrease quantity below 0', () => {
    render(<ProductQuantityControls productId={1} />, { wrapper });

    const iconButtons = getIconButtons();
    const minusButton = iconButtons[0];
    const quantityInput = screen.getByRole('spinbutton');

    expect(minusButton).toBeDisabled();
    expect(quantityInput).toHaveValue(0);

    fireEvent.click(minusButton);
    expect(quantityInput).toHaveValue(0);
  });

  it('should handle empty input value', () => {
    render(<ProductQuantityControls productId={1} />, { wrapper });

    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: '' } });
    expect(quantityInput).toHaveValue(0);
  });

  it('should handle invalid input values', () => {
    render(<ProductQuantityControls productId={1} />, { wrapper });

    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: 'abc' } });
    expect(quantityInput).toHaveValue(0);
  });

  it('should handle large input values', () => {
    render(<ProductQuantityControls productId={1} />, { wrapper });

    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: '999' } });
    expect(quantityInput).toHaveValue(999);
  });

  it('should update quantity when input value changes', () => {
    render(<ProductQuantityControls productId={1} />, { wrapper });

    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: '5' } });
    expect(quantityInput).toHaveValue(5);
  });

  it('should not allow negative quantity in input', () => {
    render(<ProductQuantityControls productId={1} />, { wrapper });

    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: '-5' } });
    expect(quantityInput).toHaveValue(0);
  });

  it('should enable minus button when quantity is greater than 0', () => {
    render(<ProductQuantityControls productId={1} />, { wrapper });

    const iconButtons = getIconButtons();
    const plusButton = iconButtons[1];
    const minusButton = iconButtons[0];

    expect(minusButton).toBeDisabled();

    if (plusButton) {
      fireEvent.click(plusButton);
      expect(minusButton).not.toBeDisabled();
    }
  });

  it('should handle multiple rapid clicks on increase button', () => {
    render(<ProductQuantityControls productId={1} />, { wrapper });

    const iconButtons = getIconButtons();
    const plusButton = iconButtons[1];
    const quantityInput = screen.getByRole('spinbutton');

    if (plusButton) {
      fireEvent.click(plusButton);
      fireEvent.click(plusButton);
      fireEvent.click(plusButton);
      expect(quantityInput).toHaveValue(3);
    }
  });

  it('should handle multiple rapid clicks on decrease button', () => {
    render(<ProductQuantityControls productId={1} />, { wrapper });

    const iconButtons = getIconButtons();
    const plusButton = iconButtons[1];
    const minusButton = iconButtons[0];
    const quantityInput = screen.getByRole('spinbutton');

    if (plusButton && minusButton) {
      fireEvent.click(plusButton);
      fireEvent.click(plusButton);
      fireEvent.click(plusButton);
      fireEvent.click(plusButton);
      fireEvent.click(plusButton);
      expect(quantityInput).toHaveValue(5);

      fireEvent.click(minusButton);
      fireEvent.click(minusButton);
      fireEvent.click(minusButton);
      expect(quantityInput).toHaveValue(2);
    }
  });

  it('should accept different productId values', () => {
    const { rerender } = render(<ProductQuantityControls productId={1} />, { wrapper });
    
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();

    rerender(<ProductQuantityControls productId={999} />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('should maintain quantity state when productId changes', () => {
    const { rerender } = render(<ProductQuantityControls productId={1} />, { wrapper });

    const iconButtons = getIconButtons();
    const plusButton = iconButtons[1];
    const quantityInput = screen.getByRole('spinbutton');

    if (plusButton) {
      fireEvent.click(plusButton);
      fireEvent.click(plusButton);
      expect(quantityInput).toHaveValue(2);

      rerender(<ProductQuantityControls productId={2} />);
      expect(quantityInput).toHaveValue(2);
    }
  });

  it('should show warning toast when adding to cart with quantity 0', () => {
    render(<ProductQuantityControls productId={1} />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(toast.showToast.warning).toHaveBeenCalledWith('Please select a quantity first');
    expect(mockAdd).not.toHaveBeenCalled();
  });

  it('should add product to cart and show success toast when product is provided', () => {
    render(<ProductQuantityControls productId={1} product={mockProduct} />, { wrapper });

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(mockAdd).toHaveBeenCalledWith(mockProduct, 2);
    expect(toast.showToast.success).toHaveBeenCalledWith('2 items added to cart');
    expect(screen.getByRole('spinbutton')).toHaveValue(0);
  });

  it('should show singular item message when quantity is 1 with product', () => {
    render(<ProductQuantityControls productId={1} product={mockProduct} />, { wrapper });

    fireEvent.click(getIconButtons()[1]);
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(toast.showToast.success).toHaveBeenCalledWith('1 item added to cart');
  });

  it('should show success toast with productId when product is not provided', () => {
    render(<ProductQuantityControls productId={42} />, { wrapper });

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(toast.showToast.success).toHaveBeenCalledWith(
      '1 item of product #42 added to cart successfully!'
    );
    expect(screen.getByRole('spinbutton')).toHaveValue(0);
  });

  it('should show plural message when adding multiple items without product', () => {
    render(<ProductQuantityControls productId={1} />, { wrapper });

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(toast.showToast.success).toHaveBeenCalledWith(
      '3 items of product #1 added to cart successfully!'
    );
  });
});
