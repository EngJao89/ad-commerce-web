import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '../ui/card';

describe('Card', () => {
  it('should render Card with data-slot', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should render CardHeader, CardTitle, CardDescription with data-slots', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
      </Card>
    );
    expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-title"]')).toHaveTextContent('Title');
    expect(container.querySelector('[data-slot="card-description"]')).toHaveTextContent('Description');
  });

  it('should render CardAction with data-slot', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardAction>
            <button type="button">Action</button>
          </CardAction>
        </CardHeader>
      </Card>
    );
    const action = container.querySelector('[data-slot="card-action"]');
    expect(action).toBeInTheDocument();
    expect(action).toContainElement(screen.getByRole('button', { name: /action/i }));
  });

  it('should render CardContent and CardFooter with data-slots', () => {
    const { container } = render(
      <Card>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(container.querySelector('[data-slot="card-content"]')).toHaveTextContent('Body');
    expect(container.querySelector('[data-slot="card-footer"]')).toHaveTextContent('Footer');
  });

  it('should apply custom className to Card', () => {
    const { container } = render(<Card className="custom-card">Content</Card>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass('custom-card');
  });
});
