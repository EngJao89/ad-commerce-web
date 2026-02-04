import { render, screen, fireEvent } from '@testing-library/react';
import FavoritesClient from '../FavoritesClient';
import { useFavorites } from '@/contexts/FavoritesContext';
import * as toastModule from '@/lib/toast';
import type { Product } from '@/@types/products';

const mockRemove = jest.fn();

jest.mock('@/contexts/FavoritesContext', () => ({
  useFavorites: jest.fn(),
}));

jest.mock('@/lib/toast', () => ({
  showToast: {
    success: jest.fn(),
  },
}));

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  category: 'electronics',
  description: 'Test description',
  image: 'https://example.com/image.jpg',
  rating: { rate: 4.5, count: 100 },
};

const mockProductWithoutRating: Product = {
  id: 2,
  title: 'Product No Rating',
  price: 29.99,
  category: 'clothing',
  description: 'No rating',
  image: 'https://example.com/image2.jpg',
};

describe('FavoritesClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('empty favorites', () => {
    beforeEach(() => {
      (useFavorites as jest.Mock).mockReturnValue({
        items: [],
        remove: mockRemove,
      });
    });

    it('should render empty state when no favorites', () => {
      render(<FavoritesClient />);

      expect(screen.getByText('No favorites yet')).toBeInTheDocument();
      expect(screen.getByText(/Save products you like by clicking the heart/)).toBeInTheDocument();
    });

    it('should render Browse products link pointing to home', () => {
      render(<FavoritesClient />);

      const link = screen.getByRole('link', { name: /browse products/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });
  });

  describe('favorites with items', () => {
    beforeEach(() => {
      (useFavorites as jest.Mock).mockReturnValue({
        items: [mockProduct],
        remove: mockRemove,
      });
    });

    it('should render product card with title and price', () => {
      render(<FavoritesClient />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText(/R\$\s*99,99/)).toBeInTheDocument();
    });

    it('should render product category badge', () => {
      render(<FavoritesClient />);

      expect(screen.getByText('electronics')).toBeInTheDocument();
    });

    it('should render rating when available', () => {
      render(<FavoritesClient />);

      expect(screen.getByText(/4\.5/)).toBeInTheDocument();
      expect(screen.getByText(/100/)).toBeInTheDocument();
    });

    it('should render link to product detail', () => {
      render(<FavoritesClient />);

      const detailLinks = screen.getAllByRole('link', { name: /test product/i });
      expect(detailLinks.length).toBeGreaterThan(0);
      expect(detailLinks[0]).toHaveAttribute('href', '/detail/1');
    });

    it('should call remove and show toast when Remove from favorites is clicked', () => {
      render(<FavoritesClient />);

      const removeButton = screen.getByRole('button', { name: /remove from favorites/i });
      fireEvent.click(removeButton);

      expect(mockRemove).toHaveBeenCalledTimes(1);
      expect(mockRemove).toHaveBeenCalledWith(1);
      expect(toastModule.showToast.success).toHaveBeenCalledWith('Removed from favorites');
    });
  });

  describe('product without rating', () => {
    beforeEach(() => {
      (useFavorites as jest.Mock).mockReturnValue({
        items: [mockProductWithoutRating],
        remove: mockRemove,
      });
    });

    it('should render product without rating section', () => {
      render(<FavoritesClient />);

      expect(screen.getByText('Product No Rating')).toBeInTheDocument();
      expect(screen.getByText(/R\$\s*29,99/)).toBeInTheDocument();
      expect(screen.queryByText(/4\.5/)).not.toBeInTheDocument();
    });
  });

  describe('multiple favorites', () => {
    beforeEach(() => {
      (useFavorites as jest.Mock).mockReturnValue({
        items: [mockProduct, mockProductWithoutRating],
        remove: mockRemove,
      });
    });

    it('should render all favorite products', () => {
      render(<FavoritesClient />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Product No Rating')).toBeInTheDocument();
    });

    it('should call remove with correct id when removing second product', () => {
      render(<FavoritesClient />);

      const removeButtons = screen.getAllByRole('button', { name: /remove from favorites/i });
      expect(removeButtons).toHaveLength(2);

      fireEvent.click(removeButtons[1]);
      expect(mockRemove).toHaveBeenCalledWith(2);
    });
  });
});
