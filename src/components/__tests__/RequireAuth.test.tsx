import { render, screen } from '@testing-library/react';
import RequireAuth from '../RequireAuth';
import { useAuth } from '@/contexts/AuthContext';
import * as toast from '@/lib/toast';

const mockRequestLogin = jest.fn();
const mockReplace = jest.fn();

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@/lib/toast', () => ({
  showToast: {
    warning: jest.fn(),
  },
}));

describe('RequireAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      requestLogin: mockRequestLogin,
    });

    render(
      <RequireAuth>
        <span data-testid="child">Protected content</span>
      </RequireAuth>
    );

    expect(screen.getByTestId('child')).toHaveTextContent('Protected content');
    expect(mockRequestLogin).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(toast.showToast.warning).not.toHaveBeenCalled();
  });

  it('should show redirect message and trigger login flow when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      requestLogin: mockRequestLogin,
    });

    render(
      <RequireAuth>
        <span data-testid="child">Protected content</span>
      </RequireAuth>
    );

    expect(screen.getByText('Redirecionando para fazer login...')).toBeInTheDocument();
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    expect(toast.showToast.warning).toHaveBeenCalledWith('Faça login para acessar esta página.');
    expect(mockRequestLogin).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/?loginRequired=1');
  });
});
