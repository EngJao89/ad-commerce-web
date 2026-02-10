import { render } from '@testing-library/react';
import ProductCardSkeleton from '../ProductCardSkeleton';

describe('ProductCardSkeleton', () => {
  it('should render a card container with expected structure', () => {
    const { container } = render(<ProductCardSkeleton />);

    const card = container.querySelector('[data-slot="card"]');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('group', 'overflow-hidden', 'flex-col');
  });

  it('should render card header with skeleton image placeholder', () => {
    const { container } = render(<ProductCardSkeleton />);

    const header = container.querySelector('[data-slot="card-header"]');
    expect(header).toBeInTheDocument();
    const skeletons = header?.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons?.length).toBeGreaterThanOrEqual(1);
  });

  it('should render card content with skeleton lines', () => {
    const { container } = render(<ProductCardSkeleton />);

    const content = container.querySelector('[data-slot="card-content"]');
    expect(content).toBeInTheDocument();
    const skeletons = content?.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons?.length).toBeGreaterThanOrEqual(1);
  });

  it('should render card footer with skeleton actions', () => {
    const { container } = render(<ProductCardSkeleton />);

    const footer = container.querySelector('[data-slot="card-footer"]');
    expect(footer).toBeInTheDocument();
    const skeletons = footer?.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons?.length).toBeGreaterThanOrEqual(1);
  });

  it('should render multiple skeleton elements for loading state', () => {
    const { container } = render(<ProductCardSkeleton />);

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(5);
  });

  it('should apply animate-pulse to skeleton elements', () => {
    const { container } = render(<ProductCardSkeleton />);

    const firstSkeleton = container.querySelector('[data-slot="skeleton"]');
    expect(firstSkeleton).toHaveClass('animate-pulse');
  });
});
