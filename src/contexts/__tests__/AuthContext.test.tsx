import { render, screen, fireEvent, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { getUserIdFromToken } from '@/lib/jwt';

jest.mock('@/lib/jwt', () => ({
  getUserIdFromToken: jest.fn(),
}));

const TOKEN_KEY = 'ad-commerce-token';
const USER_ID_KEY = 'ad-commerce-user-id';

function Consumer({
  onAuth,
}: { onAuth?: (auth: ReturnType<typeof useAuth>) => void } = {}) {
  const auth = useAuth();
  if (onAuth) onAuth(auth);
  return (
    <div>
      <span data-testid="token">{auth.token ?? 'null'}</span>
      <span data-testid="userId">{auth.userId ?? 'null'}</span>
      <span data-testid="isAuthenticated">{String(auth.isAuthenticated)}</span>
      <span data-testid="openLogin">{String(auth.openLogin)}</span>
      <button type="button" onClick={() => auth.login('new-token', 42)} data-testid="login-with-id">
        Login with ID
      </button>
      <button type="button" onClick={() => auth.login('token-only')} data-testid="login-no-id">
        Login no ID
      </button>
      <button type="button" onClick={auth.logout} data-testid="logout">
        Logout
      </button>
      <button type="button" onClick={auth.requestLogin} data-testid="request-login">
        Request login
      </button>
      <button type="button" onClick={() => auth.setOpenLogin(false)} data-testid="set-open-false">
        Close login
      </button>
    </div>
  );
}

describe('AuthContext', () => {
  const originalGetItem = Storage.prototype.getItem;
  const originalSetItem = Storage.prototype.setItem;
  const originalRemoveItem = Storage.prototype.removeItem;

  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    Storage.prototype.getItem = originalGetItem;
    Storage.prototype.setItem = originalSetItem;
    Storage.prototype.removeItem = originalRemoveItem;
  });

  describe('useAuth', () => {
    it('should throw when used outside AuthProvider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<Consumer />)).toThrow('useAuth must be used within an AuthProvider');
      consoleSpy.mockRestore();
    });
  });

  describe('AuthProvider', () => {
    it('should provide initial state from localStorage', () => {
      localStorage.setItem(TOKEN_KEY, 'stored-token');
      localStorage.setItem(USER_ID_KEY, '7');
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
      expect(screen.getByTestId('token')).toHaveTextContent('stored-token');
      expect(screen.getByTestId('userId')).toHaveTextContent('7');
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
    });

    it('should provide null token and userId when localStorage is empty', () => {
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
      expect(screen.getByTestId('token')).toHaveTextContent('null');
      expect(screen.getByTestId('userId')).toHaveTextContent('null');
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
    });

    it('should treat invalid stored userId as null', () => {
      localStorage.setItem(TOKEN_KEY, 't');
      localStorage.setItem(USER_ID_KEY, 'not-a-number');
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
      expect(screen.getByTestId('userId')).toHaveTextContent('null');
    });

    it('should login with token and userId and persist to localStorage', () => {
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
      fireEvent.click(screen.getByTestId('login-with-id'));
      expect(screen.getByTestId('token')).toHaveTextContent('new-token');
      expect(screen.getByTestId('userId')).toHaveTextContent('42');
      expect(localStorage.getItem(TOKEN_KEY)).toBe('new-token');
      expect(localStorage.getItem(USER_ID_KEY)).toBe('42');
    });

    it('should login with token only and resolve userId from JWT when possible', async () => {
      (getUserIdFromToken as jest.Mock).mockReturnValue(10);
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
      fireEvent.click(screen.getByTestId('login-no-id'));
      expect(screen.getByTestId('token')).toHaveTextContent('token-only');
      expect(screen.getByTestId('userId')).toHaveTextContent('10');
      expect(localStorage.getItem(USER_ID_KEY)).toBe('10');
    });

    it('should login with token only and set userId null when JWT has no id', () => {
      (getUserIdFromToken as jest.Mock).mockReturnValue(null);
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
      fireEvent.click(screen.getByTestId('login-no-id'));
      expect(screen.getByTestId('userId')).toHaveTextContent('null');
      expect(localStorage.getItem(USER_ID_KEY)).toBeNull();
    });

    it('should logout and clear state and localStorage', () => {
      localStorage.setItem(TOKEN_KEY, 'x');
      localStorage.setItem(USER_ID_KEY, '1');
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
      fireEvent.click(screen.getByTestId('logout'));
      expect(screen.getByTestId('token')).toHaveTextContent('null');
      expect(screen.getByTestId('userId')).toHaveTextContent('null');
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
      expect(localStorage.getItem(USER_ID_KEY)).toBeNull();
    });

    it('should set openLogin true when requestLogin is called', () => {
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
      expect(screen.getByTestId('openLogin')).toHaveTextContent('false');
      fireEvent.click(screen.getByTestId('request-login'));
      expect(screen.getByTestId('openLogin')).toHaveTextContent('true');
    });

    it('should set openLogin false when setOpenLogin(false) is called', () => {
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
      fireEvent.click(screen.getByTestId('request-login'));
      expect(screen.getByTestId('openLogin')).toHaveTextContent('true');
      fireEvent.click(screen.getByTestId('set-open-false'));
      expect(screen.getByTestId('openLogin')).toHaveTextContent('false');
    });

    it('should set openLogin false after login', () => {
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
      fireEvent.click(screen.getByTestId('request-login'));
      expect(screen.getByTestId('openLogin')).toHaveTextContent('true');
      fireEvent.click(screen.getByTestId('login-with-id'));
      expect(screen.getByTestId('openLogin')).toHaveTextContent('false');
    });

    it('should recover userId from token when token exists but userId not in storage', async () => {
      localStorage.setItem(TOKEN_KEY, 'existing-token');
      (getUserIdFromToken as jest.Mock).mockImplementation((t: string) => (t === 'existing-token' ? 5 : null));
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });
      expect(screen.getByTestId('userId')).toHaveTextContent('5');
      expect(localStorage.getItem(USER_ID_KEY)).toBe('5');
    });
  });

  describe('storage error handling', () => {
    it('should handle getStoredToken throwing', () => {
      Storage.prototype.getItem = jest.fn().mockImplementation((key: string) => {
        if (key === TOKEN_KEY) throw new Error('getItem failed');
        return originalGetItem.call(localStorage, key);
      });
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
      expect(screen.getByTestId('token')).toHaveTextContent('null');
    });

    it('should handle getStoredUserId throwing', () => {
      Storage.prototype.getItem = jest.fn().mockImplementation((key: string) => {
        if (key === USER_ID_KEY) throw new Error('getItem failed');
        return originalGetItem.call(localStorage, key);
      });
      localStorage.setItem(TOKEN_KEY, 't');
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
      expect(screen.getByTestId('userId')).toHaveTextContent('null');
    });

    it('should handle setStoredToken (removeItem) throwing', () => {
      localStorage.setItem(TOKEN_KEY, 'x');
      Storage.prototype.removeItem = jest.fn().mockImplementation(() => {
        throw new Error('removeItem failed');
      });
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
      fireEvent.click(screen.getByTestId('logout'));
      expect(screen.getByTestId('token')).toHaveTextContent('null');
    });

    it('should handle setStoredUserId throwing', () => {
      Storage.prototype.setItem = jest.fn().mockImplementation((key: string, value: string) => {
        if (key === USER_ID_KEY) throw new Error('setItem failed');
        originalSetItem.call(localStorage, key, value);
      });
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
      fireEvent.click(screen.getByTestId('login-with-id'));
      expect(screen.getByTestId('userId')).toHaveTextContent('42');
    });

    it('should handle setStoredToken setItem throwing', () => {
      Storage.prototype.setItem = jest.fn().mockImplementation((key: string, value: string) => {
        if (key === TOKEN_KEY) throw new Error('setItem failed');
        originalSetItem.call(localStorage, key, value);
      });
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
      fireEvent.click(screen.getByTestId('login-with-id'));
      expect(screen.getByTestId('token')).toHaveTextContent('new-token');
    });
  });
});
