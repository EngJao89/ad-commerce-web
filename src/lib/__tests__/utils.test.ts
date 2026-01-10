import { formatPrice } from '../utils';

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
});
