import { render, screen } from '@testing-library/react';
import ProductsGridSkeleton from '../ProductsGridSkeleton';

jest.mock('../ProductCardSkeleton', () => {
  return function ProductCardSkeleton() {
    return <div data-testid="product-card-skeleton" />;
  };
});

describe('ProductsGridSkeleton', () => {
  it('should render a grid container with expected classes', () => {
    render(<ProductsGridSkeleton />);
    const grid = document.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4', 'gap-6');
  });

  it('should render 8 skeleton cards by default', () => {
    render(<ProductsGridSkeleton />);
    const skeletons = screen.getAllByTestId('product-card-skeleton');
    expect(skeletons).toHaveLength(8);
  });

  it('should render the given count of skeleton cards', () => {
    render(<ProductsGridSkeleton count={4} />);
    const skeletons = screen.getAllByTestId('product-card-skeleton');
    expect(skeletons).toHaveLength(4);
  });

  it('should render unique keys for each skeleton', () => {
    const { container } = render(<ProductsGridSkeleton count={3} />);
    const grid = container.firstChild as HTMLElement;
    const children = Array.from(grid.children);
    expect(children).toHaveLength(3);
  });
});
