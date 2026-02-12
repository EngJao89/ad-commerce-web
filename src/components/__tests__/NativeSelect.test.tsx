import { render, screen, fireEvent } from '@testing-library/react';
import {
  NativeSelect,
  NativeSelectOption,
  NativeSelectOptGroup,
} from '../ui/native-select';

describe('NativeSelect', () => {
  it('should render wrapper and select with data-slots', () => {
    const { container } = render(
      <NativeSelect>
        <NativeSelectOption value="">Choose</NativeSelectOption>
        <NativeSelectOption value="a">Option A</NativeSelectOption>
      </NativeSelect>
    );
    expect(container.querySelector('[data-slot="native-select-wrapper"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="native-select"]')).toBeInTheDocument();
  });

  it('should render select as combobox with options', () => {
    render(
      <NativeSelect>
        <NativeSelectOption value="">Choose</NativeSelectOption>
        <NativeSelectOption value="a">Option A</NativeSelectOption>
        <NativeSelectOption value="b">Option B</NativeSelectOption>
      </NativeSelect>
    );
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('');
    expect(select).toHaveDisplayValue('Choose');
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[1]).toHaveTextContent('Option A');
    expect(options[1]).toHaveAttribute('value', 'a');
  });

  it('should have default size', () => {
    const { container } = render(
      <NativeSelect>
        <NativeSelectOption value="">Choose</NativeSelectOption>
      </NativeSelect>
    );
    const select = container.querySelector('[data-slot="native-select"]');
    expect(select).toHaveAttribute('data-size', 'default');
  });

  it('should apply size="sm"', () => {
    const { container } = render(
      <NativeSelect size="sm">
        <NativeSelectOption value="">Choose</NativeSelectOption>
      </NativeSelect>
    );
    const select = container.querySelector('[data-slot="native-select"]');
    expect(select).toHaveAttribute('data-size', 'sm');
    expect(select).toHaveClass('data-[size=sm]:h-8');
  });

  it('should render icon with data-slot', () => {
    const { container } = render(
      <NativeSelect>
        <NativeSelectOption value="">Choose</NativeSelectOption>
      </NativeSelect>
    );
    expect(container.querySelector('[data-slot="native-select-icon"]')).toBeInTheDocument();
  });

  it('should support controlled value and onChange', () => {
    const onChange = jest.fn();
    render(
      <NativeSelect value="a" onChange={onChange}>
        <NativeSelectOption value="">Choose</NativeSelectOption>
        <NativeSelectOption value="a">Option A</NativeSelectOption>
        <NativeSelectOption value="b">Option B</NativeSelectOption>
      </NativeSelect>
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('a');
    fireEvent.change(select, { target: { value: 'b' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('should pass through name and id', () => {
    render(
      <NativeSelect name="category" id="category-select">
        <NativeSelectOption value="">Choose</NativeSelectOption>
      </NativeSelect>
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('name', 'category');
    expect(select).toHaveAttribute('id', 'category-select');
  });

  it('should be disabled when disabled prop is set', () => {
    render(
      <NativeSelect disabled>
        <NativeSelectOption value="">Choose</NativeSelectOption>
      </NativeSelect>
    );
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('should apply custom className to select', () => {
    const { container } = render(
      <NativeSelect className="custom-select">
        <NativeSelectOption value="">Choose</NativeSelectOption>
      </NativeSelect>
    );
    const select = container.querySelector('[data-slot="native-select"]');
    expect(select).toHaveClass('custom-select');
  });

  it('should render NativeSelectOptGroup with options', () => {
    const { container } = render(
      <NativeSelect>
        <NativeSelectOptGroup label="Group 1">
          <NativeSelectOption value="1">One</NativeSelectOption>
          <NativeSelectOption value="2">Two</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Group 2">
          <NativeSelectOption value="3">Three</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    );
    const optgroups = container.querySelectorAll('[data-slot="native-select-optgroup"]');
    expect(optgroups).toHaveLength(2);
    expect(optgroups[0]).toHaveAttribute('label', 'Group 1');
    expect(optgroups[1]).toHaveAttribute('label', 'Group 2');
    const options = container.querySelectorAll('[data-slot="native-select-option"]');
    expect(options).toHaveLength(3);
  });
});

describe('NativeSelectOption', () => {
  it('should render option with data-slot', () => {
    const { container } = render(
      <NativeSelect>
        <NativeSelectOption value="x">Label X</NativeSelectOption>
      </NativeSelect>
    );
    const option = container.querySelector('[data-slot="native-select-option"]');
    expect(option).toBeInTheDocument();
    expect(option).toHaveAttribute('value', 'x');
    expect(option).toHaveTextContent('Label X');
  });
});
