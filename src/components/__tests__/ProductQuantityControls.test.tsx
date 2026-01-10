import { render, screen, fireEvent } from '@testing-library/react';
import ProductQuantityControls from '../ProductQuantityControls';
import * as toastModule from '@/lib/toast';

jest.mock('@/lib/toast', () => ({
  showToast: {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('ProductQuantityControls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getIconButtons = () => {
    const buttons = screen.getAllByRole('button');
    return buttons.filter(btn => btn.querySelector('svg') && !btn.textContent?.includes('Add'));
  };

  it('should render quantity controls', () => {
    render(<ProductQuantityControls productId={1} />);

    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('should initialize with quantity 0', () => {
    render(<ProductQuantityControls productId={1} />);

    const quantityInput = screen.getByRole('spinbutton');
    expect(quantityInput).toHaveValue(0);
  });

  it('should increase quantity when plus button is clicked', () => {
    render(<ProductQuantityControls productId={1} />);

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
    render(<ProductQuantityControls productId={1} />);

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
    render(<ProductQuantityControls productId={1} />);

    const iconButtons = getIconButtons();
    const minusButton = iconButtons[0];

    if (minusButton) {
      expect(minusButton).toBeDisabled();
    }
  });

  it('should disable add to cart button when quantity is 0', () => {
    render(<ProductQuantityControls productId={1} />);

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addToCartButton).toBeDisabled();
  });

  it('should enable add to cart button when quantity is greater than 0', () => {
    render(<ProductQuantityControls productId={1} />);

    const iconButtons = getIconButtons();
    const plusButton = iconButtons[1];
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });

    if (plusButton) {
      fireEvent.click(plusButton);
      expect(addToCartButton).not.toBeDisabled();
    }
  });

  it('should show success toast when adding item to cart', () => {
    render(<ProductQuantityControls productId={1} />);

    const iconButtons = getIconButtons();
    const plusButton = iconButtons[1];
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });

    if (plusButton) {
      fireEvent.click(plusButton);
      fireEvent.click(addToCartButton);

      expect(toastModule.showToast.success).toHaveBeenCalledWith(
        '1 item of product #1 added to cart successfully!'
      );
    }
  });

  it('should show success toast with plural when adding multiple items', () => {
    render(<ProductQuantityControls productId={1} />);

    const iconButtons = getIconButtons();
    const plusButton = iconButtons[1];
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });

    if (plusButton) {
      fireEvent.click(plusButton);
      fireEvent.click(plusButton);
      fireEvent.click(addToCartButton);

      expect(toastModule.showToast.success).toHaveBeenCalledWith(
        '2 items of product #1 added to cart successfully!'
      );
    }
  });

  it('should reset quantity to 0 after adding to cart', () => {
    render(<ProductQuantityControls productId={1} />);

    const iconButtons = getIconButtons();
    const plusButton = iconButtons[1];
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    const quantityInput = screen.getByRole('spinbutton');

    if (plusButton) {
      fireEvent.click(plusButton);
      fireEvent.click(plusButton);
      expect(quantityInput).toHaveValue(2);

      fireEvent.click(addToCartButton);
      expect(quantityInput).toHaveValue(0);
    }
  });

  it('should update quantity when input value changes', () => {
    render(<ProductQuantityControls productId={1} />);

    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: '5' } });
    expect(quantityInput).toHaveValue(5);
  });

  it('should not allow negative quantity in input', () => {
    render(<ProductQuantityControls productId={1} />);

    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: '-5' } });
    expect(quantityInput).toHaveValue(0);
  });
});
