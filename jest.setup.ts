// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';

// Suppress "An update to ... inside a test was not wrapped in act(...)" when providers
// hydrate from localStorage via queueMicrotask (intentional async setState in effects).
const originalError = console.error;
console.error = (...args: unknown[]) => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (msg.includes('An update to') && msg.includes('inside a test was not wrapped in act')) return;
  originalError.apply(console, args);
};

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: {
    alt: string;
    src: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    priority?: boolean;
    sizes?: string;
  }) => {
    const { fill, ...imgProps } = props;
    return React.createElement('img', {
      ...imgProps,
      ...(fill ? { style: { width: '100%', height: '100%', objectFit: 'cover' } } : {}),
    });
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => {
    return React.createElement('a', { href, ...props }, children);
  },
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));
