import { AxiosError } from 'axios';
import { showToast, showApiError, showApiSuccess } from '../toast';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => {
  const success = jest.fn();
  const error = jest.fn();
  const warning = jest.fn();
  const info = jest.fn();
  const promise = jest.fn(<T,>(p: Promise<T>, m: { success: string }) => p.then(() => m.success));
  const base = jest.fn();
  return {
    toast: Object.assign(base, { success, error, warning, info, promise }),
  };
});

describe('showToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call toast.success with message', () => {
    showToast.success('Operação concluída');
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith('Operação concluída');
  });

  it('should call toast.error with message', () => {
    showToast.error('Algo deu errado');
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith('Algo deu errado');
  });

  it('should call toast.warning with message', () => {
    showToast.warning('Atenção');
    expect(toast.warning).toHaveBeenCalledTimes(1);
    expect(toast.warning).toHaveBeenCalledWith('Atenção');
  });

  it('should call toast.info with message', () => {
    showToast.info('Informação');
    expect(toast.info).toHaveBeenCalledTimes(1);
    expect(toast.info).toHaveBeenCalledWith('Informação');
  });

  it('should call toast (default) with message', () => {
    showToast.default('Mensagem padrão');
    expect(toast).toHaveBeenCalledWith('Mensagem padrão');
  });

  it('should call toast.promise with promise and messages', () => {
    const promise = Promise.resolve('ok');
    const messages = {
      pending: 'Carregando...',
      success: 'Sucesso!',
      error: 'Erro!',
    };
    showToast.promise(promise, messages);
    expect(toast.promise).toHaveBeenCalledTimes(1);
    expect(toast.promise).toHaveBeenCalledWith(promise, messages);
  });
});

describe('showApiError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show response.data.message when AxiosError has response with data.message', () => {
    const error = new AxiosError('err', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
      data: { message: 'Mensagem do servidor' },
    });
    showApiError(error);
    expect(toast.error).toHaveBeenCalledWith('Mensagem do servidor');
  });

  it('should show error.message when AxiosError has response but no data.message', () => {
    const error = new AxiosError('Mensagem do axios', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: {} as never,
      data: {},
    });
    showApiError(error);
    expect(toast.error).toHaveBeenCalledWith('Mensagem do axios');
  });

  it('should show error.message when AxiosError response has no data', () => {
    const error = new AxiosError('err', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 500,
      statusText: 'OK',
      headers: {},
      config: {} as never,
      data: undefined,
    });
    showApiError(error);
    expect(toast.error).toHaveBeenCalledWith('err');
  });

  it('should show connection message for ECONNRESET when request exists', () => {
    const error = new AxiosError('err', 'ECONNRESET', undefined, {}, undefined);
    (error as { request: unknown }).request = {};
    showApiError(error);
    expect(toast.error).toHaveBeenCalledWith(
      'Connection error. The server may be temporarily unavailable. Please try again in a moment.'
    );
  });

  it('should show connection message for ETIMEDOUT when request exists', () => {
    const error = new AxiosError('err', 'ETIMEDOUT', undefined, {}, undefined);
    (error as { request: unknown }).request = {};
    showApiError(error);
    expect(toast.error).toHaveBeenCalledWith(
      'Connection error. The server may be temporarily unavailable. Please try again in a moment.'
    );
  });

  it('should show connection message for ENOTFOUND when request exists', () => {
    const error = new AxiosError('err', 'ENOTFOUND', undefined, {}, undefined);
    (error as { request: unknown }).request = {};
    showApiError(error);
    expect(toast.error).toHaveBeenCalledWith(
      'Connection error. The server may be temporarily unavailable. Please try again in a moment.'
    );
  });

  it('should show ECONNREFUSED message when request exists', () => {
    const error = new AxiosError('err', 'ECONNREFUSED', undefined, {}, undefined);
    (error as { request: unknown }).request = {};
    showApiError(error);
    expect(toast.error).toHaveBeenCalledWith(
      'Unable to connect to the server. Please check your internet connection.'
    );
  });

  it('should show generic network message for other request errors', () => {
    const error = new AxiosError('err', 'SOME_CODE', undefined, {}, undefined);
    (error as { request: unknown }).request = {};
    showApiError(error);
    expect(toast.error).toHaveBeenCalledWith(
      'Network error. Please check your connection and try again.'
    );
  });

  it('should show error.message when AxiosError has no response nor request', () => {
    const error = new AxiosError('Erro de configuração', 'ERR_BAD_REQUEST');
    showApiError(error);
    expect(toast.error).toHaveBeenCalledWith('Erro de configuração');
  });

  it('should show Error message for plain Error instance', () => {
    showApiError(new Error('Erro genérico'));
    expect(toast.error).toHaveBeenCalledWith('Erro genérico');
  });

  it('should show default message for unknown error', () => {
    showApiError('string error');
    expect(toast.error).toHaveBeenCalledWith('An error occurred');
  });
});

describe('showApiSuccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call showToast.success with message', () => {
    showApiSuccess('Salvo com sucesso');
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith('Salvo com sucesso');
  });
});
