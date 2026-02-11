import { render, screen, fireEvent } from '@testing-library/react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '../ui/sheet';

describe('Sheet', () => {
  it('should render trigger when closed', () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <button type="button">Open sheet</button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByRole('button', { name: /open sheet/i })).toBeInTheDocument();
  });

  it('should render SheetTrigger with data-slot', () => {
    const { container } = render(
      <Sheet>
        <SheetTrigger asChild>
          <button type="button">Open</button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const trigger = container.querySelector('[data-slot="sheet-trigger"]');
    expect(trigger).toBeInTheDocument();
  });

  it('should show content when open is true', () => {
    render(
      <Sheet open>
        <SheetTrigger asChild>
          <button type="button">Open</button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet Title</SheetTitle>
          <p>Sheet body content</p>
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByRole('dialog', { name: /sheet title/i })).toBeInTheDocument();
    expect(screen.getByText('Sheet body content')).toBeInTheDocument();
  });

  it('should render sheet header, title and description', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>My Title</SheetTitle>
            <SheetDescription>My description text</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByRole('dialog', { name: /my title/i })).toBeInTheDocument();
    expect(screen.getByText('My description text')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sheet-header"]')).toBeInTheDocument();
  });

  it('should render sheet footer', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
          <SheetFooter>
            <button type="button">Cancel</button>
            <button type="button">Save</button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
    expect(document.querySelector('[data-slot="sheet-footer"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should have sheet content with data-slot', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
          Content
        </SheetContent>
      </Sheet>
    );
    expect(document.querySelector('[data-slot="sheet-content"]')).toBeInTheDocument();
  });

  it('should show close button by default', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('should not show close button when showCloseButton is false', () => {
    render(
      <Sheet open>
        <SheetContent showCloseButton={false}>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

  it('should call onOpenChange when close button is clicked', () => {
    const onOpenChange = jest.fn();
    render(
      <Sheet open onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should render SheetClose and call onOpenChange when clicked', () => {
    const onOpenChange = jest.fn();
    render(
      <Sheet open onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
          <SheetClose asChild>
            <button type="button">Custom close</button>
          </SheetClose>
        </SheetContent>
      </Sheet>
    );
    fireEvent.click(screen.getByRole('button', { name: /custom close/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should apply side classes for right by default', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const content = document.querySelector('[data-slot="sheet-content"]');
    expect(content).toHaveClass('right-0', 'border-l');
  });

  it('should apply side classes for left when side="left"', () => {
    render(
      <Sheet open>
        <SheetContent side="left">
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const content = document.querySelector('[data-slot="sheet-content"]');
    expect(content).toHaveClass('left-0', 'border-r');
  });

  it('should apply side classes for top when side="top"', () => {
    render(
      <Sheet open>
        <SheetContent side="top">
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const content = document.querySelector('[data-slot="sheet-content"]');
    expect(content).toHaveClass('top-0', 'border-b');
  });

  it('should apply side classes for bottom when side="bottom"', () => {
    render(
      <Sheet open>
        <SheetContent side="bottom">
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const content = document.querySelector('[data-slot="sheet-content"]');
    expect(content).toHaveClass('bottom-0', 'border-t');
  });
});
