import { render } from '@testing-library/react';
import ToastContainer from '../ToastContainer';

interface ToastContainerProps {
  position?: string;
  autoClose?: number;
  hideProgressBar?: boolean;
  newestOnTop?: boolean;
  closeOnClick?: boolean;
  rtl?: boolean;
  pauseOnFocusLoss?: boolean;
  draggable?: boolean;
  pauseOnHover?: boolean;
  theme?: string;
  toastClassName?: string;
  progressClassName?: string;
}

const mockToastContainer = jest.fn<void, [ToastContainerProps]>(() => null);

jest.mock('react-toastify', () => ({
  ToastContainer: (props: ToastContainerProps) => {
    mockToastContainer(props);
    return null;
  },
}));

describe('ToastContainer', () => {
  beforeEach(() => {
    mockToastContainer.mockClear();
  });

  it('should render react-toastify ToastContainer with expected props', () => {
    render(<ToastContainer />);

    expect(mockToastContainer).toHaveBeenCalledTimes(1);
    const props = mockToastContainer.mock.calls[0][0];
    expect(props).toMatchObject({
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      newestOnTop: false,
      closeOnClick: true,
      rtl: false,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
      theme: 'dark',
      toastClassName: 'bg-zinc-800 text-white border border-zinc-700',
      progressClassName: 'bg-zinc-600',
    });
  });

  it('should pass position top-right', () => {
    render(<ToastContainer />);
    expect(mockToastContainer).toHaveBeenCalledWith(
      expect.objectContaining({ position: 'top-right' })
    );
  });

  it('should use dark theme and custom toast styles', () => {
    render(<ToastContainer />);
    const props = mockToastContainer.mock.calls[0][0];
    expect(props.theme).toBe('dark');
    expect(props.toastClassName).toContain('bg-zinc-800');
    expect(props.progressClassName).toContain('bg-zinc-600');
  });
});
