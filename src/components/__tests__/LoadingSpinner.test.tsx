import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render spinner with default size', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status', { name: /loading/i });
    expect(spinner).toBeInTheDocument();
  });

  it('should render spinner with small size', () => {
    render(<LoadingSpinner size="sm" />);
    
    const spinner = screen.getByRole('status', { name: /loading/i });
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('size-4');
  });

  it('should render spinner with medium size', () => {
    render(<LoadingSpinner size="md" />);
    
    const spinner = screen.getByRole('status', { name: /loading/i });
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('size-6');
  });

  it('should render spinner with large size', () => {
    render(<LoadingSpinner size="lg" />);
    
    const spinner = screen.getByRole('status', { name: /loading/i });
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('size-8');
  });

  it('should apply custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    
    const container = document.querySelector('.custom-class');
    expect(container).toBeInTheDocument();
  });
});
