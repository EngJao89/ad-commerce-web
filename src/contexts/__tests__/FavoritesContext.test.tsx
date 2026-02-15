import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../AuthContext';
import { FavoritesProvider, useFavorites } from '../FavoritesContext';
import type { Product } from '@/@types/products';

const AUTH_STORAGE_KEY = 'ad-commerce-token';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <FavoritesProvider>{children}</FavoritesProvider>
  </AuthProvider>
);

const mockProductA: Product = {
  id: 1,
  title: 'Product A',
  price: 10,
  description: 'Desc A',
  category: 'cat-a',
  image: 'https://example.com/a.jpg',
  rating: { rate: 4, count: 10 },
};

const mockProductB: Product = {
  id: 2,
  title: 'Product B',
  price: 25.5,
  description: 'Desc B',
  category: 'cat-b',
  image: 'https://example.com/b.jpg',
};

function TestConsumer() {
  const favorites = useFavorites();
  return (
    <div>
      <span data-testid="count">{favorites.items.length}</span>
      <span data-testid="is-fav-1">{favorites.isFavorite(1) ? 'yes' : 'no'}</span>
      <span data-testid="is-fav-2">{favorites.isFavorite(2) ? 'yes' : 'no'}</span>
      <button
        type="button"
        onClick={() => favorites.add(mockProductA)}
        data-testid="add-a"
      >
        Add A
      </button>
      <button
        type="button"
        onClick={() => favorites.add(mockProductB)}
        data-testid="add-b"
      >
        Add B
      </button>
      <button
        type="button"
        onClick={() => favorites.remove(1)}
        data-testid="remove-a"
      >
        Remove A
      </button>
      <button
        type="button"
        onClick={() => favorites.toggle(mockProductA)}
        data-testid="toggle-a"
      >
        Toggle A
      </button>
      <button
        type="button"
        onClick={() => favorites.toggle(mockProductB)}
        data-testid="toggle-b"
      >
        Toggle B
      </button>
    </div>
  );
}

describe('useFavorites', () => {
  it('should throw when used outside FavoritesProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      'useFavorites must be used within a FavoritesProvider'
    );

    consoleSpy.mockRestore();
  });
});

describe('FavoritesProvider', () => {
  const storageKey = 'ad-commerce-favorites';

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(AUTH_STORAGE_KEY, 'test-token');
    jest.clearAllMocks();
  });

  it('should provide initial empty favorites when localStorage is empty', async () => {
    render(<TestConsumer />, { wrapper });

    await screen.findByTestId('count');

    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('is-fav-1')).toHaveTextContent('no');
    expect(screen.getByTestId('is-fav-2')).toHaveTextContent('no');
  });

  it('should add product and update count', async () => {
    render(<TestConsumer />, { wrapper });

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));

    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('is-fav-1')).toHaveTextContent('yes');
    expect(screen.getByTestId('is-fav-2')).toHaveTextContent('no');
  });

  it('should not add duplicate when adding same product again', async () => {
    render(<TestConsumer />, { wrapper });

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));
    fireEvent.click(screen.getByTestId('add-a'));

    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('should add multiple different products', async () => {
    render(<TestConsumer />, { wrapper });

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));
    fireEvent.click(screen.getByTestId('add-b'));

    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByTestId('is-fav-1')).toHaveTextContent('yes');
    expect(screen.getByTestId('is-fav-2')).toHaveTextContent('yes');
  });

  it('should remove product by id', async () => {
    render(<TestConsumer />, { wrapper });

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));
    fireEvent.click(screen.getByTestId('add-b'));
    fireEvent.click(screen.getByTestId('remove-a'));

    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('is-fav-1')).toHaveTextContent('no');
    expect(screen.getByTestId('is-fav-2')).toHaveTextContent('yes');
  });

  it('should toggle product on when not in favorites', async () => {
    render(<TestConsumer />, { wrapper });

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('toggle-a'));

    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('is-fav-1')).toHaveTextContent('yes');
  });

  it('should toggle product off when already in favorites', async () => {
    render(<TestConsumer />, { wrapper });

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));
    fireEvent.click(screen.getByTestId('toggle-a'));

    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('is-fav-1')).toHaveTextContent('no');
  });

  it('should persist favorites to localStorage after updates', async () => {
    render(<TestConsumer />, { wrapper });

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));

    const stored = localStorage.getItem(storageKey);
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe(1);
    expect(parsed[0].title).toBe('Product A');
  });

  it('should hydrate from localStorage on mount', async () => {
    const initial = [mockProductA, mockProductB];
    localStorage.setItem(storageKey, JSON.stringify(initial));

    render(<TestConsumer />, { wrapper });

    await screen.findByTestId('count');

    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByTestId('is-fav-1')).toHaveTextContent('yes');
    expect(screen.getByTestId('is-fav-2')).toHaveTextContent('yes');
  });

  it('should treat non-array localStorage value as empty favorites', async () => {
    localStorage.setItem(storageKey, '{"foo": "bar"}');

    render(<TestConsumer />, { wrapper });

    await screen.findByTestId('count');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('should treat invalid JSON in localStorage as empty favorites', async () => {
    localStorage.setItem(storageKey, 'invalid json');

    render(<TestConsumer />, { wrapper });

    await screen.findByTestId('count');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('should not throw when localStorage.setItem fails', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded');
    });

    render(<TestConsumer />, { wrapper });

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');

    setItemSpy.mockRestore();
  });

  describe('when user is not logged in', () => {
    beforeEach(() => {
      localStorage.clear();
      jest.clearAllMocks();
    });

    it('should provide empty favorites and not persist to localStorage', async () => {
      render(<TestConsumer />, { wrapper });

      await screen.findByTestId('count');

      expect(screen.getByTestId('count')).toHaveTextContent('0');
      expect(screen.getByTestId('is-fav-1')).toHaveTextContent('no');
      expect(localStorage.getItem(storageKey)).toBeNull();
    });

    it('should clear favorites from localStorage when no token', async () => {
      localStorage.setItem(storageKey, JSON.stringify([mockProductA]));

      render(<TestConsumer />, { wrapper });

      await screen.findByTestId('count');

      expect(screen.getByTestId('count')).toHaveTextContent('0');
      expect(localStorage.getItem(storageKey)).toBeNull();
    });
  });
});
