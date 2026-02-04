import api from '../axios';

describe('axios api instance', () => {
  it('should have correct baseURL', () => {
    expect(api.defaults.baseURL).toBe('https://fakestoreapi.com/');
  });

  it('should have JSON content-type header', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('should be an axios instance with request methods', () => {
    expect(api).toBeDefined();
    expect(typeof api.get).toBe('function');
    expect(typeof api.post).toBe('function');
  });

  it('should have baseURL and headers configured', () => {
    expect(api.defaults.baseURL).toBe('https://fakestoreapi.com/');
    expect(api.defaults.headers).toEqual(
      expect.objectContaining({
        'Content-Type': 'application/json',
      })
    );
  });
});
