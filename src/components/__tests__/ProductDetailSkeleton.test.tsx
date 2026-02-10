import { render } from '@testing-library/react';
import ProductDetailSkeleton from '../ProductDetailSkeleton';

describe('ProductDetailSkeleton', () => {
  it('should render container with expected layout classes', () => {
    const { container } = render(<ProductDetailSkeleton />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('container', 'mx-auto', 'px-4', 'py-8', 'max-w-7xl');
  });

  it('should render a two-column grid layout', () => {
    const { container } = render(<ProductDetailSkeleton />);

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1', 'lg:grid-cols-2', 'gap-8');
  });

  it('should render main image skeleton with rounded-lg and full width', () => {
    const { container } = render(<ProductDetailSkeleton />);

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    const imageSkeleton = Array.from(skeletons).find(
      (el) => el.classList.contains('rounded-lg') && el.classList.contains('w-full')
    );
    expect(imageSkeleton).toBeInTheDocument();
  });

  it('should render multiple skeleton elements for loading state', () => {
    const { container } = render(<ProductDetailSkeleton />);

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(5);
  });

  it('should render separators between content sections', () => {
    const { container } = render(<ProductDetailSkeleton />);

    const separators = container.querySelectorAll('[data-slot="separator"]');
    expect(separators.length).toBe(3);
  });

  it('should apply animate-pulse to skeleton elements', () => {
    const { container } = render(<ProductDetailSkeleton />);

    const firstSkeleton = container.querySelector('[data-slot="skeleton"]');
    expect(firstSkeleton).toHaveClass('animate-pulse');
  });

  it('should render right column with flex layout', () => {
    const { container } = render(<ProductDetailSkeleton />);

    const grid = container.querySelector('.grid');
    const rightColumn = grid?.children[1];
    expect(rightColumn).toHaveClass('flex', 'flex-col', 'gap-6');
  });
});
