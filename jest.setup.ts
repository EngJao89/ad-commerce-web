// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';

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
