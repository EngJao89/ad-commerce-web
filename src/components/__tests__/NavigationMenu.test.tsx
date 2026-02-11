import { render, screen, fireEvent } from '@testing-library/react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '../ui/navigation-menu';

class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

beforeAll(() => {
  globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
});

describe('NavigationMenu', () => {
  it('should render root with data-slot', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Item</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const root = container.querySelector('[data-slot="navigation-menu"]');
    expect(root).toBeInTheDocument();
  });

  it('should render list with data-slot and expected classes', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Link</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const list = container.querySelector('[data-slot="navigation-menu-list"]');
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass('flex', 'list-none', 'items-center');
  });

  it('should render menu item with data-slot', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Products</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const item = container.querySelector('[data-slot="navigation-menu-item"]');
    expect(item).toBeInTheDocument();
  });

  it('should render NavigationMenuLink as link with href', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/products">Products</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const link = screen.getByRole('link', { name: /products/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/products');
  });

  it('should set data-viewport on root when viewport is true (default)', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Item</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const root = container.querySelector('[data-slot="navigation-menu"]');
    expect(root).toHaveAttribute('data-viewport', 'true');
  });

  it('should not render viewport when viewport is false', () => {
    const { container } = render(
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Item</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const viewport = container.querySelector('[data-slot="navigation-menu-viewport"]');
    expect(viewport).not.toBeInTheDocument();
  });

  it('should render trigger with data-slot and chevron', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            <NavigationMenuContent>Dropdown content</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const trigger = container.querySelector('[data-slot="navigation-menu-trigger"]');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('Menu');
  });

  it('should render content with data-slot when trigger is activated', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Open menu</NavigationMenuTrigger>
            <NavigationMenuContent>
              <p>Dropdown content</p>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const trigger = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(trigger);
    const content = document.querySelector('[data-slot="navigation-menu-content"]');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Dropdown content');
  });

  it('should apply custom className to root', () => {
    const { container } = render(
      <NavigationMenu className="custom-nav">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Item</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const root = container.querySelector('[data-slot="navigation-menu"]');
    expect(root).toHaveClass('custom-nav');
  });

  it('should have data-viewport attribute on root', () => {
    const { container } = render(
      <NavigationMenu viewport={true}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Item</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const root = container.querySelector('[data-slot="navigation-menu"]');
    expect(root).toHaveAttribute('data-viewport', 'true');
  });

  it('should render NavigationMenuLink with data-slot', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Link text</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const linkSlot = container.querySelector('[data-slot="navigation-menu-link"]');
    expect(linkSlot).toBeInTheDocument();
    expect(linkSlot).toHaveTextContent('Link text');
  });
});
