import { getUserIdFromToken } from '../jwt';

function b64(s: string): string {
  return Buffer.from(s, 'utf-8').toString('base64').replace(/=/g, '');
}

describe('getUserIdFromToken', () => {
  it('should return null when token has fewer than 3 parts', () => {
    expect(getUserIdFromToken('')).toBeNull();
    expect(getUserIdFromToken('a')).toBeNull();
    expect(getUserIdFromToken('a.b')).toBeNull();
  });

  it('should return null when token has more than 3 parts', () => {
    expect(getUserIdFromToken('a.b.c.d')).toBeNull();
  });

  it('should return null when payload part is empty', () => {
    expect(getUserIdFromToken('header..signature')).toBeNull();
  });

  it('should return userId from sub (number)', () => {
    const payload = b64(JSON.stringify({ sub: 1 }));
    expect(getUserIdFromToken(`header.${payload}.sig`)).toBe(1);
  });

  it('should return userId from sub (string)', () => {
    const payload = b64(JSON.stringify({ sub: '42' }));
    expect(getUserIdFromToken(`header.${payload}.sig`)).toBe(42);
  });

  it('should return userId from id when sub is missing', () => {
    const payload = b64(JSON.stringify({ id: 3 }));
    expect(getUserIdFromToken(`header.${payload}.sig`)).toBe(3);
  });

  it('should return null when sub and id are missing', () => {
    const payload = b64(JSON.stringify({ foo: 'bar' }));
    expect(getUserIdFromToken(`header.${payload}.sig`)).toBeNull();
  });

  it('should return null when sub is not a valid number', () => {
    const payload = b64(JSON.stringify({ sub: 'abc' }));
    expect(getUserIdFromToken(`header.${payload}.sig`)).toBeNull();
  });

  it('should return null when payload is invalid base64', () => {
    expect(getUserIdFromToken('header.invalid!!!.sig')).toBeNull();
  });

  it('should return null when payload decodes to invalid JSON', () => {
    const payload = Buffer.from('not json', 'utf-8').toString('base64');
    expect(getUserIdFromToken(`header.${payload}.sig`)).toBeNull();
  });

  it('should handle base64url padding (replace - and _)', () => {
    const payload = b64(JSON.stringify({ sub: 5 }));
    const base64url = payload.replace(/\+/g, '-').replace(/\//g, '_');
    expect(getUserIdFromToken(`header.${base64url}.sig`)).toBe(5);
  });
});
