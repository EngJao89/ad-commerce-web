import { render, screen } from '@testing-library/react';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('should render with default props', () => {
    render(<EmptyState />);
    
    expect(screen.getByText('No products found')).toBeInTheDocument();
    expect(screen.getByText(/We couldn't find any products matching your criteria/)).toBeInTheDocument();
  });

  it('should render with custom title and message', () => {
    render(
      <EmptyState
        title="Custom Title"
        message="Custom message"
      />
    );
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('should render action button when actionHref is provided', () => {
    render(
      <EmptyState
        actionHref="/products"
        actionLabel="Go to Products"
      />
    );
    
    const link = screen.getByRole('link', { name: /Go to Products/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/products');
  });

  it('should not render action button when actionHref is explicitly undefined', () => {
    render(
      <EmptyState
        actionHref={undefined}
        actionLabel={undefined}
      />
    );
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
