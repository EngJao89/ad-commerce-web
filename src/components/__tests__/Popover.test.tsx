import { render, screen, fireEvent } from '@testing-library/react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverAnchor,
} from '../ui/popover';

describe('Popover', () => {
  it('should render trigger', () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <button type="button">Open popover</button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );
    expect(screen.getByRole('button', { name: /open popover/i })).toBeInTheDocument();
  });

  it('should have data-slot on trigger', () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger asChild>
          <button type="button">Trigger</button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );
    const trigger = container.querySelector('[data-slot="popover-trigger"]');
    expect(trigger).toBeInTheDocument();
  });

  it('should show content when open is true', () => {
    render(
      <Popover open>
        <PopoverTrigger asChild>
          <button type="button">Trigger</button>
        </PopoverTrigger>
        <PopoverContent>
          <p>Popover body</p>
        </PopoverContent>
      </Popover>
    );
    expect(screen.getByText('Popover body')).toBeInTheDocument();
  });

  it('should render popover content with data-slot when open', () => {
    render(
      <Popover open>
        <PopoverTrigger asChild>
          <button type="button">Trigger</button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );
    expect(document.querySelector('[data-slot="popover-content"]')).toBeInTheDocument();
  });

  it('should render PopoverHeader, PopoverTitle and PopoverDescription', () => {
    render(
      <Popover open>
        <PopoverTrigger asChild>
          <button type="button">Trigger</button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Popover Title</PopoverTitle>
            <PopoverDescription>Popover description text</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    );
    expect(document.querySelector('[data-slot="popover-header"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="popover-title"]')).toHaveTextContent('Popover Title');
    expect(document.querySelector('[data-slot="popover-description"]')).toHaveTextContent(
      'Popover description text'
    );
  });

  it('should open content when trigger is clicked', () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <button type="button">Open</button>
        </PopoverTrigger>
        <PopoverContent>
          <p>Inside popover</p>
        </PopoverContent>
      </Popover>
    );
    expect(screen.queryByText('Inside popover')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /open/i }));
    expect(screen.getByText('Inside popover')).toBeInTheDocument();
  });

  it('should call onOpenChange when trigger is clicked', () => {
    const onOpenChange = jest.fn();
    render(
      <Popover onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button type="button">Open</button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );
    fireEvent.click(screen.getByRole('button', { name: /open/i }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('should apply custom className to PopoverContent', () => {
    render(
      <Popover open>
        <PopoverTrigger asChild>
          <button type="button">Trigger</button>
        </PopoverTrigger>
        <PopoverContent className="custom-popover">Content</PopoverContent>
      </Popover>
    );
    const content = document.querySelector('[data-slot="popover-content"]');
    expect(content).toHaveClass('custom-popover');
  });

  it('should render PopoverAnchor when used', () => {
    const { container } = render(
      <Popover>
        <PopoverAnchor asChild>
          <span>Anchor</span>
        </PopoverAnchor>
        <PopoverTrigger asChild>
          <button type="button">Trigger</button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );
    const anchor = container.querySelector('[data-slot="popover-anchor"]');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveTextContent('Anchor');
  });

  it('should accept align and sideOffset props on content', () => {
    render(
      <Popover open>
        <PopoverTrigger asChild>
          <button type="button">Trigger</button>
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={8}>
          Content
        </PopoverContent>
      </Popover>
    );
    const content = document.querySelector('[data-slot="popover-content"]');
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute('data-align', 'end');
  });
});
