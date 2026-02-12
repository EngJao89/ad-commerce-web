import { render, screen } from '@testing-library/react';
import {
  ButtonGroup,
  ButtonGroupText,
  ButtonGroupSeparator,
} from '../ui/button-group';

describe('ButtonGroup', () => {
  it('should render with role="group" and data-slot', () => {
    const { container } = render(
      <ButtonGroup>
        <button type="button">One</button>
        <button type="button">Two</button>
      </ButtonGroup>
    );
    const group = container.querySelector('[data-slot="button-group"]');
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute('role', 'group');
  });

  it('should render children', () => {
    render(
      <ButtonGroup>
        <button type="button">First</button>
        <button type="button">Second</button>
      </ButtonGroup>
    );
    expect(screen.getByRole('button', { name: /first/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /second/i })).toBeInTheDocument();
  });

  it('should have horizontal orientation by default', () => {
    const { container } = render(
      <ButtonGroup>
        <button type="button">A</button>
      </ButtonGroup>
    );
    const group = container.querySelector('[data-slot="button-group"]');
    expect(group).toHaveClass('flex');
    expect(group).not.toHaveClass('flex-col');
  });

  it('should apply vertical orientation when orientation="vertical"', () => {
    const { container } = render(
      <ButtonGroup orientation="vertical">
        <button type="button">A</button>
        <button type="button">B</button>
      </ButtonGroup>
    );
    const group = container.querySelector('[data-slot="button-group"]');
    expect(group).toHaveAttribute('data-orientation', 'vertical');
    expect(group).toHaveClass('flex-col');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ButtonGroup className="custom-group">
        <button type="button">A</button>
      </ButtonGroup>
    );
    const group = container.querySelector('[data-slot="button-group"]');
    expect(group).toHaveClass('custom-group');
  });
});

describe('ButtonGroupText', () => {
  it('should render as div with expected classes', () => {
    const { container } = render(
      <ButtonGroup>
        <ButtonGroupText>Label</ButtonGroupText>
        <button type="button">Action</button>
      </ButtonGroup>
    );
    const text = container.querySelector('.bg-muted');
    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent('Label');
    expect(text).toHaveClass('rounded-md', 'border', 'px-4', 'text-sm');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ButtonGroup>
        <ButtonGroupText className="custom-text">Label</ButtonGroupText>
      </ButtonGroup>
    );
    const text = container.querySelector('.custom-text');
    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent('Label');
  });

  it('should render as child when asChild is true', () => {
    render(
      <ButtonGroup>
        <ButtonGroupText asChild>
          <span data-testid="child-label">Custom label</span>
        </ButtonGroupText>
      </ButtonGroup>
    );
    const child = screen.getByTestId('child-label');
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent('Custom label');
  });
});

describe('ButtonGroupSeparator', () => {
  it('should render with data-slot', () => {
    const { container } = render(
      <ButtonGroup>
        <button type="button">Left</button>
        <ButtonGroupSeparator />
        <button type="button">Right</button>
      </ButtonGroup>
    );
    const separator = container.querySelector('[data-slot="button-group-separator"]');
    expect(separator).toBeInTheDocument();
  });

  it('should pass orientation to separator', () => {
    const { container } = render(
      <ButtonGroup orientation="vertical">
        <button type="button">Top</button>
        <ButtonGroupSeparator orientation="horizontal" />
        <button type="button">Bottom</button>
      </ButtonGroup>
    );
    const separator = container.querySelector('[data-slot="button-group-separator"]');
    expect(separator).toBeInTheDocument();
  });
});
