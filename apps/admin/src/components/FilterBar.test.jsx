import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import FilterBar from './FilterBar';

const fields = [
  { key: 'phone', label: 'Phone', placeholder: '+234...' },
  { key: 'status', label: 'Status', type: 'select', options: ['pending', 'success', 'failed'] },
  { key: 'from', label: 'From', type: 'date' },
];

const renderFilterBar = () => {
  const values = { phone: '', status: '', from: '' };
  const setFilter = vi.fn();
  const onReset = vi.fn();
  const utils = render(
    <FilterBar
      fields={fields}
      getFilter={(key) => values[key]}
      setFilter={setFilter}
      onReset={onReset}
    />
  );
  return { ...utils, setFilter, onReset };
};

describe('FilterBar', () => {
  it('gives the text filter an accessible name from its label', () => {
    renderFilterBar();
    expect(screen.getByRole('textbox', { name: 'Phone' })).toBeInTheDocument();
  });

  it('names the select filter by its label alone, not its selected option', () => {
    renderFilterBar();
    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveAccessibleName('Status');
  });

  it('gives non-text inputs an accessible name from their label', () => {
    renderFilterBar();
    expect(screen.getByLabelText('From')).toHaveAccessibleName('From');
  });

  it('gives every interactive control a programmatically-determinable name', () => {
    const { container } = renderFilterBar();
    const controls = container.querySelectorAll('input, select, button');
    // One control per field, plus the Reset button.
    expect(controls).toHaveLength(fields.length + 1);
    controls.forEach((control) => {
      expect(control).toHaveAccessibleName();
    });
    fields.forEach((field) => {
      expect(screen.getByTestId(`filter-${field.key}`)).toHaveAccessibleName(field.label);
    });
  });

  it('explicitly associates each label with a uniquely-identified control', () => {
    renderFilterBar();
    renderFilterBar();
    const phones = screen.getAllByRole('textbox', { name: 'Phone' });
    expect(phones).toHaveLength(2);
    expect(phones[0].id).not.toBe(phones[1].id);
    phones.forEach((input) => {
      expect(document.querySelector(`label[for="${CSS.escape(input.id)}"]`)).toHaveTextContent('Phone');
    });
  });

  it('forwards changes and resets through the provided callbacks', async () => {
    const user = userEvent.setup();
    const { setFilter, onReset } = renderFilterBar();

    await user.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'failed');
    expect(setFilter).toHaveBeenCalledWith('status', 'failed');

    await user.type(screen.getByRole('textbox', { name: 'Phone' }), '1');
    expect(setFilter).toHaveBeenCalledWith('phone', '1');

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
