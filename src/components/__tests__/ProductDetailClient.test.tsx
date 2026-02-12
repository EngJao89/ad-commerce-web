import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProductDetailClient from '../ProductDetailClient';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import api from '@/lib/axios';
import * as toastModule from '@/lib/toast';
import type { Product } from '@/@types/products';

const mockToggleFavorite = jest.fn();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

jest.mock('@/contexts/FavoritesContext', () => ({
  ...jest.requireActual('@/contexts/FavoritesContext'),
  useFavorites: jest.fn(),
}));

jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('@/lib/toast', () => ({
  showApiError: jest.fn(),
  showToast: { success: jest.fn() },
}));

jest.mock('../ProductDetailSkeleton', () => {
  return function ProductDetailSkeleton() {
    return <div data-testid="product-detail-skeleton">Loading...</div>;
  };
});

jest.mock('../ProductQuantityControls', () => {
  return function ProductQuantityControls({ productId }: { productId: number }) {
    return <div data-testid="product-quantity-controls">Quantity Controls for {productId}</div>;
  };
});

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  category: 'electronics',
  description: 'This is a test product description',
  image: 'https://example.com/image.jpg',
  rating: {
    rate: 4.5,
    count: 100,
  },
};

const mockProductWithoutRating: Product = {
  id: 2,
  title: 'Product Without Rating',
  price: 49.99,
  category: 'clothing',
  description: 'Product without rating',
  image: 'https://example.com/image2.jpg',
};

describe('ProductDetailClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useFavorites as jest.Mock).mockReturnValue({
      toggle: mockToggleFavorite,
      isFavorite: jest.fn(() => false),
    });
  });

  it('should show loading skeleton initially', () => {
    (api.get as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<ProductDetailClient productId="1" />, { wrapper });
    
    expect(screen.getByTestId('product-detail-skeleton')).toBeInTheDocument();
  });

  it('should render product details when data is loaded', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProduct });
    
    render(<ProductDetailClient productId="1" />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a test product description/)).toBeInTheDocument();
    expect(screen.getByText(/R\$/)).toBeInTheDocument();
  });

  it('should render product rating when available', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProduct });
    
    render(<ProductDetailClient productId="1" />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/100 ratings/)).toBeInTheDocument();
  });

  it('should not render rating section when rating is not available', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProductWithoutRating });
    
    render(<ProductDetailClient productId="2" />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Product Without Rating')).toBeInTheDocument();
    });
    
    expect(screen.queryByText(/ratings/)).not.toBeInTheDocument();
  });

  it('should render back to products link when product is not found', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: null });
    
    render(<ProductDetailClient productId="1" />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Go back to products')).toBeInTheDocument();
    });
    
    const backLink = screen.getByRole('link', { name: /go back to products/i });
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('should render ProductQuantityControls with correct productId', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProduct });
    
    render(<ProductDetailClient productId="1" />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getByTestId('product-quantity-controls')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Quantity Controls for 1/)).toBeInTheDocument();
  });

  it('should show error message and toast when API call fails', async () => {
    const error = new Error('Failed to fetch product');
    (api.get as jest.Mock).mockRejectedValue(error);
    
    render(<ProductDetailClient productId="1" />, { wrapper });
    
    await waitFor(() => {
      expect(toastModule.showApiError).toHaveBeenCalledWith(error);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Product not found')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/The product you are looking for does not exist or has been removed/)).toBeInTheDocument();
  });

  it('should show error state with back link when product is not found', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('Not found'));
    
    render(<ProductDetailClient productId="999" />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Product not found')).toBeInTheDocument();
    });
    
    const links = screen.getAllByRole('link');
    const backLinks = links.filter(link => link.getAttribute('href') === '/');
    expect(backLinks.length).toBeGreaterThan(0);
  });

  it('should call API with correct productId', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProduct });
    
    render(<ProductDetailClient productId="123" />, { wrapper });
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('products/123');
    });
  });

  it('should format price correctly', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProduct });
    
    render(<ProductDetailClient productId="1" />, { wrapper });
    
    await waitFor(() => {
      const priceElement = screen.getByText(/R\$/);
      expect(priceElement).toBeInTheDocument();
    });
  });

  it('should render product image with correct alt text', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProduct });
    
    render(<ProductDetailClient productId="1" />, { wrapper });
    
    await waitFor(() => {
      const image = screen.getByAltText('Test Product');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });
  });

  it('should re-fetch when productId changes', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProduct });
    
    const { rerender } = render(<ProductDetailClient productId="1" />, { wrapper });
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('products/1');
    });
    
    jest.clearAllMocks();
    (api.get as jest.Mock).mockResolvedValue({ data: mockProductWithoutRating });
    
    rerender(<ProductDetailClient productId="2" />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('products/2');
    });
  });

  it('should add to favorites and show toast when heart is clicked and product is not favorited', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProduct });
    render(<ProductDetailClient productId="1" />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalledWith(mockProduct);
    expect(toastModule.showToast.success).toHaveBeenCalledWith('Added to favorites');
  });

  it('should remove from favorites and show toast when heart is clicked and product is favorited', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProduct });
    (useFavorites as jest.Mock).mockReturnValue({
      toggle: mockToggleFavorite,
      isFavorite: jest.fn(() => true),
    });

    render(<ProductDetailClient productId="1" />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const favoriteButton = screen.getByRole('button', { name: /remove from favorites/i });
    fireEvent.click(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalledWith(mockProduct);
    expect(toastModule.showToast.success).toHaveBeenCalledWith('Removed from favorites');
  });
});
