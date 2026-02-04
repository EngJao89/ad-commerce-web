import { cn, formatPrice } from '../utils';

describe('cn', () => {
  it('should return single class string', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('should merge multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should filter out falsy values', () => {
    expect(cn('foo', false, 'bar', null, undefined)).toBe('foo bar');
  });

  it('should merge tailwind classes and override conflicting utilities', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active');
  });

  it('should return empty string when all inputs are falsy', () => {
    expect(cn(false, null, undefined)).toBe('');
  });
});

describe('formatPrice', () => {
  it('should format price in Brazilian Real format', () => {
    const price = 99.99;
    const formatted = formatPrice(price);

    expect(formatted).toMatch(/R\$/);
    expect(formatted).toContain('99,99');
  });

  it('should format zero correctly', () => {
    const price = 0;
    const formatted = formatPrice(price);

    expect(formatted).toMatch(/R\$\s*0,00/);
  });

  it('should format large numbers correctly', () => {
    const price = 1234.56;
    const formatted = formatPrice(price);

    expect(formatted).toContain('1.234,56');
  });

  it('should format integer price without decimals', () => {
    const formatted = formatPrice(100);
    expect(formatted).toMatch(/R\$/);
    expect(formatted).toContain('100,00');
  });

  it('should format negative price', () => {
    const formatted = formatPrice(-50.5);
    expect(formatted).toMatch(/R\$/);
    expect(formatted).toContain('50');
  });
});
