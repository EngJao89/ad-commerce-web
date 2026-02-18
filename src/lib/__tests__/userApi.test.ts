import api from '../axios';
import { getUserById } from '../userApi';

jest.mock('../axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe('userApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user when api.get resolves with data', async () => {
      const user = { id: 1, username: 'johnd' };
      (api.get as jest.Mock).mockResolvedValue({ data: user });

      const result = await getUserById(1);

      expect(api.get).toHaveBeenCalledWith('users/1');
      expect(result).toEqual(user);
    });

    it('should return null when api.get resolves with null data', async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: null });

      const result = await getUserById(2);

      expect(result).toBeNull();
    });

    it('should return null when api.get resolves with undefined data', async () => {
      (api.get as jest.Mock).mockResolvedValue({});

      const result = await getUserById(3);

      expect(result).toBeNull();
    });

    it('should return null when api.get rejects', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await getUserById(1);

      expect(result).toBeNull();
    });
  });
});
