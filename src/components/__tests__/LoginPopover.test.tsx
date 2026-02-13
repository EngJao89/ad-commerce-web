import { render, screen, fireEvent } from '@testing-library/react';
import LoginPopover from '../LoginPopover';
import api from '@/lib/axios';
import * as toast from '@/lib/toast';
import { AxiosError } from 'axios';

jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

jest.mock('@/lib/toast', () => ({
  showToast: {
    warning: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
  showApiError: jest.fn(),
}));

function openPopover() {
  const trigger = screen.getByRole('button', { name: /login/i });
  fireEvent.click(trigger);
}

describe('LoginPopover', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('trigger and content', () => {
    it('should render login trigger button with aria-label', () => {
      render(<LoginPopover />);
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('should show popover content when trigger is clicked', () => {
      render(<LoginPopover />);
      openPopover();

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveTextContent('Entrar');
      expect(dialog).toHaveTextContent(/Use seu usuário e senha/);
      expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('seu usuário')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^Entrar$/ })).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('should show warning toast when submitting with empty username', () => {
      render(<LoginPopover />);
      openPopover();

      const passwordInput = screen.getByLabelText(/senha/i);
      fireEvent.change(passwordInput, { target: { value: 'pass123' } });
      fireEvent.submit(screen.getByRole('button', { name: /^Entrar$/ }).closest('form')!);

      expect(toast.showToast.warning).toHaveBeenCalledWith('Preencha usuário e senha.');
      expect(api.post).not.toHaveBeenCalled();
    });

    it('should show warning toast when submitting with empty password', () => {
      render(<LoginPopover />);
      openPopover();

      const usernameInput = screen.getByLabelText(/usuário/i);
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.submit(screen.getByRole('button', { name: /^Entrar$/ }).closest('form')!);

      expect(toast.showToast.warning).toHaveBeenCalledWith('Preencha usuário e senha.');
      expect(api.post).not.toHaveBeenCalled();
    });
  });

  describe('successful login', () => {
    it('should call api.post with credentials and show success toast', async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { token: 'jwt-token' } });

      render(<LoginPopover />);
      openPopover();

      fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'testpass' } });
      fireEvent.submit(screen.getByRole('button', { name: /^Entrar$/ }).closest('form')!);

      await screen.findByRole('button', { name: /login/i });

      expect(api.post).toHaveBeenCalledWith(
        '/auth/login',
        { username: 'testuser', password: 'testpass' },
        expect.objectContaining({ headers: { 'Content-Type': 'application/json' } })
      );
      expect(toast.showToast.success).toHaveBeenCalledWith('Login realizado com sucesso!');
    });

    it('should show error toast when API returns success without token', async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: {} });

      render(<LoginPopover />);
      openPopover();

      fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'testpass' } });
      fireEvent.submit(screen.getByRole('button', { name: /^Entrar$/ }).closest('form')!);

      await screen.findByRole('button', { name: /^Entrar$/ });

      expect(toast.showToast.error).toHaveBeenCalledWith('Resposta inválida do servidor.');
      expect(toast.showToast.success).not.toHaveBeenCalled();
    });
  });

  describe('login errors', () => {
    it('should show error toast on 401 response', async () => {
      const err = new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: {} as never,
        data: {},
      });
      (api.post as jest.Mock).mockRejectedValue(err);

      render(<LoginPopover />);
      openPopover();

      fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'wrong' } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'wrong' } });
      fireEvent.submit(screen.getByRole('button', { name: /^Entrar$/ }).closest('form')!);

      await screen.findByRole('button', { name: /^Entrar$/ });

      expect(toast.showToast.error).toHaveBeenCalledWith('Usuário ou senha incorretos.');
      expect(toast.showApiError).not.toHaveBeenCalled();
    });

    it('should call showApiError on other request errors', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(<LoginPopover />);
      openPopover();

      fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'testpass' } });
      fireEvent.submit(screen.getByRole('button', { name: /^Entrar$/ }).closest('form')!);

      await screen.findByRole('button', { name: /^Entrar$/ });

      expect(toast.showApiError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
