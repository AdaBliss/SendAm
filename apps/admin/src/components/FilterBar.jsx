import { useId } from 'react';

// Reusable filter bar for admin list pages. `fields` is an array of
// { key, label, placeholder?, type?: 'text' | 'select', options?: string[] }.
// Values are read from the URL via `getFilter` and written via `setFilter`,
// which keeps them in sync with the shared list query state.
//
// Each control is tied to its visible label via `htmlFor`/`id` rather than by
// nesting it inside the <label>. Implicit (wrapping) labels are resolved
// inconsistently by some screen readers and voice-control tools, so the
// explicit association guarantees every filter's accessible name is exactly
// its label text. `useId` keeps ids unique when several bars share a page.
export default function FilterBar({ fields = [], getFilter, setFilter, onReset }) {
  const idPrefix = useId();
  return (
    <form
      className="flex flex-wrap items-end gap-3 mb-4"
      onSubmit={(e) => e.preventDefault()}
    >
      {fields.map((field) => {
        const value = getFilter(field.key);
        const common = 'text-sm rounded-lg border border-gray-200 bg-white px-3 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40';
        const id = `${idPrefix}-filter-${field.key}`;
        return (
          <div key={field.key} className="flex flex-col gap-1 text-xs text-gray-500">
            <label htmlFor={id}>{field.label}</label>
            {field.type === 'select' ? (
              <select
                id={id}
                className={common}
                value={value}
                onChange={(e) => setFilter(field.key, e.target.value)}
                data-testid={`filter-${field.key}`}
              >
                <option value="">All</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                id={id}
                type={field.type || 'text'}
                className={common}
                placeholder={field.placeholder || ''}
                value={value}
                onChange={(e) => setFilter(field.key, e.target.value)}
                data-testid={`filter-${field.key}`}
              />
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={onReset}
        className="text-sm rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium shadow-sm hover:bg-gray-50"
        data-testid="filter-reset"
      >
        Reset
      </button>
    </form>
  );
}
