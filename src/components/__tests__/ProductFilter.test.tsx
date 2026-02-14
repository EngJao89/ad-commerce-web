import { render, screen, fireEvent } from '@testing-library/react';
import ProductFilter from '../ProductFilter';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import type { Product } from '@/@types/products';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>
    <FavoritesProvider>{children}</FavoritesProvider>
  </CartProvider>
);

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Product A',
    price: 10.99,
    category: 'electronics',
    description: 'Description A',
    image: 'https://example.com/image1.jpg',
    rating: { rate: 4.5, count: 100 },
  },
  {
    id: 2,
    title: 'Product B',
    price: 20.5,
    category: 'clothing',
    description: 'Description B',
    image: 'https://example.com/image2.jpg',
    rating: { rate: 4.0, count: 50 },
  },
  {
    id: 3,
    title: 'Product C',
    price: 5.99,
    category: 'electronics',
    description: 'Description C',
    image: 'https://example.com/image3.jpg',
  },
];

describe('ProductFilter', () => {
  it('should render all products by default', () => {
    render(<ProductFilter products={mockProducts} />, { wrapper });

    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
    expect(screen.getByText('Product C')).toBeInTheDocument();
    expect(screen.getByText(/3 product\(s\) found/)).toBeInTheDocument();
  });

  it('should filter products by category', () => {
    render(<ProductFilter products={mockProducts} />, { wrapper });

    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: 'electronics' } });

    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product C')).toBeInTheDocument();
    expect(screen.queryByText('Product B')).not.toBeInTheDocument();
    expect(screen.getByText(/2 product\(s\) found/)).toBeInTheDocument();
  });

  it('should show all products when "all" category is selected', () => {
    render(<ProductFilter products={mockProducts} />, { wrapper });

    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: 'electronics' } });
    fireEvent.change(categorySelect, { target: { value: 'all' } });

    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
    expect(screen.getByText('Product C')).toBeInTheDocument();
  });

  it('should sort products by price ascending', () => {
    render(<ProductFilter products={mockProducts} />, { wrapper });

    const priceToggle = screen.getByLabelText(/preço crescente/i);
    fireEvent.click(priceToggle);

    const products = screen.getAllByText(/Product/);
    expect(products[0]).toHaveTextContent('Product C');
  });

  it('should sort products by price descending', () => {
    render(<ProductFilter products={mockProducts} />, { wrapper });

    const priceToggle = screen.getByLabelText(/preço decrescente/i);
    fireEvent.click(priceToggle);

    const products = screen.getAllByText(/Product/);
    expect(products[0]).toHaveTextContent('Product B');
  });

  it('should clear price sort when toggling selected option off', () => {
    render(<ProductFilter products={mockProducts} />, { wrapper });

    const priceAsc = screen.getByLabelText(/preço crescente/i);
    fireEvent.click(priceAsc);
    const productsAfterSort = screen.getAllByText(/Product/);
    expect(productsAfterSort[0]).toHaveTextContent('Product C');

    fireEvent.click(priceAsc);
    expect(screen.getByText(/3 product\(s\) found/)).toBeInTheDocument();
  });

  it('should clear name sort when toggling selected option off', () => {
    render(<ProductFilter products={mockProducts} />, { wrapper });

    const nameAz = screen.getByLabelText(/nome a-z/i);
    fireEvent.click(nameAz);
    fireEvent.click(nameAz);
    expect(screen.getByText(/3 product\(s\) found/)).toBeInTheDocument();
  });

  it('should sort products by name A-Z', () => {
    render(<ProductFilter products={mockProducts} />, { wrapper });

    const nameToggle = screen.getByLabelText(/nome a-z/i);
    fireEvent.click(nameToggle);

    const products = screen.getAllByText(/Product/);
    expect(products[0]).toHaveTextContent('Product A');
    expect(products[1]).toHaveTextContent('Product B');
    expect(products[2]).toHaveTextContent('Product C');
  });

  it('should sort products by name Z-A', () => {
    render(<ProductFilter products={mockProducts} />, { wrapper });

    const nameToggle = screen.getByLabelText(/nome z-a/i);
    fireEvent.click(nameToggle);

    const products = screen.getAllByText(/Product/);
    expect(products[0]).toHaveTextContent('Product C');
    expect(products[1]).toHaveTextContent('Product B');
    expect(products[2]).toHaveTextContent('Product A');
  });

  it('should show empty state when no products match filter', () => {
    render(<ProductFilter products={mockProducts} />, { wrapper });

    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: 'nonexistent' } });

    expect(screen.getByText('No products found')).toBeInTheDocument();
    expect(screen.queryByText('Product A')).not.toBeInTheDocument();
  });

  it('should show empty state with generic message when products array is empty', () => {
    render(<ProductFilter products={[]} />, { wrapper });

    expect(screen.getByText('No products found')).toBeInTheDocument();
    expect(screen.getByText(/No products available at the moment. Please try again later./)).toBeInTheDocument();
  });

  it('should hide category filter when hideCategoryFilter is true', () => {
    render(<ProductFilter products={mockProducts} hideCategoryFilter />, { wrapper });

    expect(screen.queryByLabelText(/category/i)).not.toBeInTheDocument();
  });

  it('should use defaultCategory prop', () => {
    render(<ProductFilter products={mockProducts} defaultCategory="electronics" />, { wrapper });

    const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement;
    expect(categorySelect.value).toBe('electronics');

    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product C')).toBeInTheDocument();
    expect(screen.queryByText('Product B')).not.toBeInTheDocument();
  });

  it('should combine category filter and price sort', () => {
    render(<ProductFilter products={mockProducts} />, { wrapper });

    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: 'electronics' } });

    const priceToggle = screen.getByLabelText(/preço crescente/i);
    fireEvent.click(priceToggle);

    const products = screen.getAllByText(/Product/);
    expect(products).toHaveLength(2);
    expect(products[0]).toHaveTextContent('Product C');
    expect(products[1]).toHaveTextContent('Product A');
  });
});
