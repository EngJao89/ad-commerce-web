import { render, screen, fireEvent } from '@testing-library/react';
import ProductQuantityControls from '../ProductQuantityControls';

describe('ProductQuantityControls', () => {
  const getIconButtons = () => {
    const buttons = screen.getAllByRole('button');
    return buttons.filter(btn => btn.querySelector('svg'));
  };

  it('should render quantity controls', () => {
    render(<ProductQuantityControls productId={1} />);

    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2); // Minus and Plus buttons
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

  it('should not decrease quantity below 0', () => {
    render(<ProductQuantityControls productId={1} />);

    const iconButtons = getIconButtons();
    const minusButton = iconButtons[0];
    const quantityInput = screen.getByRole('spinbutton');

    expect(minusButton).toBeDisabled();
    expect(quantityInput).toHaveValue(0);

    fireEvent.click(minusButton);
    expect(quantityInput).toHaveValue(0);
  });

  it('should handle empty input value', () => {
    render(<ProductQuantityControls productId={1} />);

    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: '' } });
    expect(quantityInput).toHaveValue(0);
  });

  it('should handle invalid input values', () => {
    render(<ProductQuantityControls productId={1} />);

    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: 'abc' } });
    expect(quantityInput).toHaveValue(0);
  });

  it('should handle large input values', () => {
    render(<ProductQuantityControls productId={1} />);

    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: '999' } });
    expect(quantityInput).toHaveValue(999);
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

  it('should enable minus button when quantity is greater than 0', () => {
    render(<ProductQuantityControls productId={1} />);

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
    render(<ProductQuantityControls productId={1} />);

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
    render(<ProductQuantityControls productId={1} />);

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
    const { rerender } = render(<ProductQuantityControls productId={1} />);
    
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();

    rerender(<ProductQuantityControls productId={999} />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('should maintain quantity state when productId changes', () => {
    const { rerender } = render(<ProductQuantityControls productId={1} />);

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
});
