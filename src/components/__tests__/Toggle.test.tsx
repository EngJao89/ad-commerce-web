import { render, screen, fireEvent } from '@testing-library/react';
import { Toggle } from '../ui/toggle';

describe('Toggle', () => {
  it('should render with children', () => {
    render(<Toggle>Toggle label</Toggle>);
    expect(screen.getByRole('button', { name: /toggle label/i })).toBeInTheDocument();
  });

  it('should have data-slot="toggle"', () => {
    const { container } = render(<Toggle>Click me</Toggle>);
    const toggle = container.querySelector('[data-slot="toggle"]');
    expect(toggle).toBeInTheDocument();
  });

  it('should apply default variant and size classes', () => {
    const { container } = render(<Toggle>Default</Toggle>);
    const toggle = container.querySelector('[data-slot="toggle"]');
    expect(toggle).toHaveClass('bg-transparent', 'h-9', 'min-w-9');
  });

  it('should apply outline variant when provided', () => {
    const { container } = render(<Toggle variant="outline">Outline</Toggle>);
    const toggle = container.querySelector('[data-slot="toggle"]');
    expect(toggle).toHaveClass('border', 'border-input');
  });

  it('should apply size="sm" when provided', () => {
    const { container } = render(<Toggle size="sm">Small</Toggle>);
    const toggle = container.querySelector('[data-slot="toggle"]');
    expect(toggle).toHaveClass('h-8', 'min-w-8');
  });

  it('should apply size="lg" when provided', () => {
    const { container } = render(<Toggle size="lg">Large</Toggle>);
    const toggle = container.querySelector('[data-slot="toggle"]');
    expect(toggle).toHaveClass('h-10', 'min-w-10');
  });

  it('should call onPressedChange when clicked', () => {
    const onPressedChange = jest.fn();
    render(
      <Toggle onPressedChange={onPressedChange}>Toggle</Toggle>
    );
    const button = screen.getByRole('button', { name: /toggle/i });
    fireEvent.click(button);
    expect(onPressedChange).toHaveBeenCalledWith(true);
    fireEvent.click(button);
    expect(onPressedChange).toHaveBeenCalledWith(false);
  });

  it('should support controlled pressed state', () => {
    const onPressedChange = jest.fn();
    const { rerender } = render(
      <Toggle pressed={false} onPressedChange={onPressedChange}>
        Controlled
      </Toggle>
    );
    const button = screen.getByRole('button', { name: /controlled/i });
    expect(button).toHaveAttribute('data-state', 'off');

    rerender(
      <Toggle pressed={true} onPressedChange={onPressedChange}>
        Controlled
      </Toggle>
    );
    expect(button).toHaveAttribute('data-state', 'on');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Toggle disabled>Disabled</Toggle>);
    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Toggle className="custom-toggle">Custom</Toggle>
    );
    const toggle = container.querySelector('[data-slot="toggle"]');
    expect(toggle).toHaveClass('custom-toggle');
  });
});
