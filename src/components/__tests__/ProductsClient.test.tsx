import { render, screen, waitFor } from '@testing-library/react';
import ProductsClient from '../ProductsClient';
import api from '@/lib/axios';
import * as toastModule from '@/lib/toast';
import type { Product } from '@/@types/products';

jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('@/lib/toast', () => ({
  showApiError: jest.fn(),
}));

jest.mock('../ProductFilter', () => {
  return function ProductFilter({ products }: { products: Product[] }) {
    return <div data-testid="product-filter">Product Filter with {products.length} products</div>;
  };
});

jest.mock('../EmptyState', () => {
  return function EmptyState({ title, message }: { title: string; message: string }) {
    return (
      <div data-testid="empty-state">
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    );
  };
});

jest.mock('../LoadingSpinner', () => {
  return function LoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Product 1',
    price: 10.99,
    category: 'electronics',
    description: 'Description 1',
    image: 'https://example.com/image1.jpg',
    rating: { rate: 4.5, count: 100 },
  },
  {
    id: 2,
    title: 'Product 2',
    price: 20.5,
    category: 'clothing',
    description: 'Description 2',
    image: 'https://example.com/image2.jpg',
    rating: { rate: 4.0, count: 50 },
  },
];

describe('ProductsClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading spinner initially', () => {
    (api.get as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<ProductsClient />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText(/Explore our collection of products/)).toBeInTheDocument();
  });

  it('should render products when data is loaded', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProducts });
    
    render(<ProductsClient />);
    
    await waitFor(() => {
      expect(screen.getByTestId('product-filter')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Product Filter with 2 products')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('should show empty state when no products are returned', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [] });
    
    render(<ProductsClient />);
    
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
    
    expect(screen.getByText('No products available')).toBeInTheDocument();
    expect(screen.getByText(/We couldn't load any products at the moment/)).toBeInTheDocument();
  });

  it('should show error toast and empty state when API call fails', async () => {
    const error = new Error('Failed to fetch products');
    (api.get as jest.Mock).mockRejectedValue(error);
    
    render(<ProductsClient />);
    
    await waitFor(() => {
      expect(toastModule.showApiError).toHaveBeenCalledWith(error);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
    
    expect(screen.getByText('No products available')).toBeInTheDocument();
  });

  it('should call API with correct endpoint', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProducts });
    
    render(<ProductsClient />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('products');
    });
  });

  it('should render header with title and description', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProducts });
    
    render(<ProductsClient />);
    
    await waitFor(() => {
      expect(screen.getByText('Products')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Explore our collection of products/)).toBeInTheDocument();
  });

  it('should pass products to ProductFilter component', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProducts });
    
    render(<ProductsClient />);
    
    await waitFor(() => {
      expect(screen.getByTestId('product-filter')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Product Filter with 2 products')).toBeInTheDocument();
  });

  it('should handle single product', async () => {
    const singleProduct = [mockProducts[0]];
    (api.get as jest.Mock).mockResolvedValue({ data: singleProduct });
    
    render(<ProductsClient />);
    
    await waitFor(() => {
      expect(screen.getByTestId('product-filter')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Product Filter with 1 products')).toBeInTheDocument();
  });

  it('should handle large number of products', async () => {
    const manyProducts = Array.from({ length: 100 }, (_, i) => ({
      ...mockProducts[0],
      id: i + 1,
      title: `Product ${i + 1}`,
    }));
    
    (api.get as jest.Mock).mockResolvedValue({ data: manyProducts });
    
    render(<ProductsClient />);
    
    await waitFor(() => {
      expect(screen.getByTestId('product-filter')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Product Filter with 100 products')).toBeInTheDocument();
  });

  it('should not show loading spinner after data is loaded', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProducts });
    
    render(<ProductsClient />);
    
    await waitFor(() => {
      expect(screen.getByTestId('product-filter')).toBeInTheDocument();
    });
    
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  it('should not show empty state when products are loaded', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProducts });
    
    render(<ProductsClient />);
    
    await waitFor(() => {
      expect(screen.getByTestId('product-filter')).toBeInTheDocument();
    });
    
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  });

  it('should handle network errors gracefully', async () => {
    const networkError = new Error('Network Error');
    (api.get as jest.Mock).mockRejectedValue(networkError);
    
    render(<ProductsClient />);
    
    await waitFor(() => {
      expect(toastModule.showApiError).toHaveBeenCalledWith(networkError);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it('should reset products to empty array on error', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<ProductsClient />);
    
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
    
    expect(screen.queryByTestId('product-filter')).not.toBeInTheDocument();
  });
});
