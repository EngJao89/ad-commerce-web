import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';
import type { Product } from '@/@types/products';

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
  const cart = useCart();
  return (
    <div>
      <span data-testid="count">{cart.items.length}</span>
      <span data-testid="total-items">{cart.totalItems}</span>
      <span data-testid="total-price">{cart.totalPrice}</span>
      <button
        type="button"
        onClick={() => cart.add(mockProductA, 2)}
        data-testid="add-a"
      >
        Add A
      </button>
      <button
        type="button"
        onClick={() => cart.add(mockProductB, 1)}
        data-testid="add-b"
      >
        Add B
      </button>
      <button
        type="button"
        onClick={() => cart.add(mockProductA, 0)}
        data-testid="add-a-zero"
      >
        Add A (0)
      </button>
      <button
        type="button"
        onClick={() => cart.remove(1)}
        data-testid="remove-a"
      >
        Remove A
      </button>
      <button
        type="button"
        onClick={() => cart.updateQuantity(1, 5)}
        data-testid="update-a"
      >
        Update A to 5
      </button>
      <button
        type="button"
        onClick={() => cart.updateQuantity(1, 0)}
        data-testid="update-a-zero"
      >
        Update A to 0
      </button>
      <button type="button" onClick={() => cart.clear()} data-testid="clear">
        Clear
      </button>
    </div>
  );
}

describe('useCart', () => {
  it('should throw when used outside CartProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      'useCart must be used within a CartProvider'
    );

    consoleSpy.mockRestore();
  });
});

describe('CartProvider', () => {
  const storageKey = 'ad-commerce-cart';

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should provide initial empty cart when localStorage is empty', async () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await screen.findByTestId('count');

    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
  });

  it('should add product and update totalItems and totalPrice', async () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));

    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('20');
  });

  it('should increase quantity when adding same product again', async () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));
    fireEvent.click(screen.getByTestId('add-a'));

    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('total-items')).toHaveTextContent('4');
    expect(screen.getByTestId('total-price')).toHaveTextContent('40');
  });

  it('should add multiple different products', async () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));
    fireEvent.click(screen.getByTestId('add-b'));

    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByTestId('total-items')).toHaveTextContent('3');
    expect(screen.getByTestId('total-price')).toHaveTextContent('45.5');
  });

  it('should remove product by id', async () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));
    fireEvent.click(screen.getByTestId('add-b'));
    fireEvent.click(screen.getByTestId('remove-a'));

    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('total-items')).toHaveTextContent('1');
    expect(screen.getByTestId('total-price')).toHaveTextContent('25.5');
  });

  it('should update quantity for product', async () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));
    fireEvent.click(screen.getByTestId('update-a'));

    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('total-items')).toHaveTextContent('5');
    expect(screen.getByTestId('total-price')).toHaveTextContent('50');
  });

  it('should not add when quantity is 0', async () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a-zero'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
  });

  it('should preserve other items when updating quantity of one', async () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));
    fireEvent.click(screen.getByTestId('add-b'));
    fireEvent.click(screen.getByTestId('update-a'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByTestId('total-items')).toHaveTextContent('6');
    expect(Number(screen.getByTestId('total-price').textContent)).toBe(75.5);
  });

  it('should clear all items', async () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));
    fireEvent.click(screen.getByTestId('add-b'));
    fireEvent.click(screen.getByTestId('clear'));

    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
  });

  it('should persist cart to localStorage after updates', async () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));

    const stored = localStorage.getItem(storageKey);
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].product.id).toBe(1);
    expect(parsed[0].quantity).toBe(2);
  });

  it('should hydrate from localStorage on mount', async () => {
    const initial = [
      { product: mockProductA, quantity: 3 },
      { product: mockProductB, quantity: 1 },
    ];
    localStorage.setItem(storageKey, JSON.stringify(initial));

    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await screen.findByTestId('count');

    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByTestId('total-items')).toHaveTextContent('4');
    expect(Number(screen.getByTestId('total-price').textContent)).toBe(55.5);
  });

  it('should treat non-array localStorage value as empty cart', async () => {
    localStorage.setItem(storageKey, '{"foo": "bar"}');

    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await screen.findByTestId('count');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
  });

  it('should treat invalid JSON in localStorage as empty cart', async () => {
    localStorage.setItem(storageKey, 'invalid json');

    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await screen.findByTestId('count');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
  });

  it('should not throw when localStorage.setItem fails', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded');
    });

    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');

    setItemSpy.mockRestore();
  });

  it('should update quantity of existing item when cart has multiple items', async () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));
    fireEvent.click(screen.getByTestId('add-b'));
    fireEvent.click(screen.getByTestId('add-a'));

    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByTestId('total-items')).toHaveTextContent('5');
    expect(Number(screen.getByTestId('total-price').textContent)).toBe(65.5);
  });

  it('should remove item when updateQuantity is called with 0', async () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    await screen.findByTestId('count');
    fireEvent.click(screen.getByTestId('add-a'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');

    fireEvent.click(screen.getByTestId('update-a-zero'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
  });
});
