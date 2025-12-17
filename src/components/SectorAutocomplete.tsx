// src/components/SectorAutocomplete.tsx
import { Icon } from '@iconify/react';
import React, { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface SectorAutocompleteProps<T, Multiple extends boolean = false> {
  label: string;
  data: T[];
  onSearch: (query: string) => void;
  value: Multiple extends true ? T[] : T | null;
  onChange: (value: Multiple extends true ? T[] : T | null) => void;
  multiple?: Multiple;
  allowNoSpecify?: boolean;
  placeholder?: string;
  required?: boolean;
  name?: string;
  getLabel: (item: T) => string;
  getKey?: (item: T) => string | number;
  getDescription?: (item: T) => string;
  loading?: boolean;
}

export default function SectorAutocomplete<T, Multiple extends boolean = false>({
  label,
  data,
  onSearch,
  value,
  onChange,
  multiple = false as Multiple,
  allowNoSpecify = true,
  placeholder = 'Search...',
  required = false,
  name,
  getLabel,
  getKey = (item: any) => (item as any)?.key ?? (item as any)?.id ?? String(item),
  getDescription,
  loading = false,
}: SectorAutocompleteProps<T, Multiple>) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [noSpecify, setNoSpecify] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null); // ← NUEVO
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const memoizedOnSearch = useCallback(
    (query: string) => {
      onSearch(query);
    },
    [onSearch],
  );

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      memoizedOnSearch(search.trim());
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search, memoizedOnSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current && 
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleSelect = (item: T) => {
    console.log('🔵 ITEM SELECCIONADO:', item); 
    if (multiple) {
      const current = (value as T[]) || [];
      const alreadySelected = current.some((selected) => getKey(selected) === getKey(item));
      if (!alreadySelected) {
        onChange([...current, item] as any);
      }
    } else {
      console.log('🟢 LLAMANDO onChange con:', item); 
      onChange(item as any);
      setNoSpecify(false);
      setSearch(''); 
    }
    setShowDropdown(false);
  };

  const handleRemove = (itemToRemove: T) => {
    if (multiple) {
      const current = (value as T[]) || [];
      onChange(current.filter((item) => getKey(item) !== getKey(itemToRemove)) as any);
    }
  };

  const handleClearAll = () => {
    if (multiple) {
      onChange([] as any);
    }
    setNoSpecify(false);
    setSearch('');
  };

  const handleNoSpecifyChange = (checked: boolean) => {
    setNoSpecify(checked);
    if (checked) {
      if (multiple) {
        onChange([] as any);
      } else {
        onChange(null as any);
      }
      setSearch('');
    }
  };

  const selectedLabels = multiple
    ? (value as T[] | undefined ?? []).map(getLabel)
    : value ? [getLabel(value as T)] : [];

  const finalValue = noSpecify ? 'Sin especificar' : selectedLabels.join(', ');

  const inputRect = inputRef.current?.getBoundingClientRect();

  const dropdownContent = showDropdown && (
    <div
      ref={dropdownRef} 
      className="bg-white border border-[hsl(var(--gob-gray-300))] rounded-lg shadow-xl max-h-60 overflow-y-auto"
      style={{
        position: 'fixed',
        top: inputRect ? inputRect.bottom + window.scrollY + 8 : undefined,
        left: inputRect ? inputRect.left + window.scrollX : undefined,
        width: inputRect ? inputRect.width : '100%',
        zIndex: 1000,
      }}
    >
      {loading ? (
        <div className="p-4 text-center text-gray-500">Searching...</div>
      ) : data.length > 0 ? (
        data.map((item) => (
          <button
            key={getKey(item)}
            type="button"
            onClick={() => handleSelect(item)}
            className="w-full text-left px-4 py-3 hover:bg-[hsl(var(--gob-gray-100))] transition-colors border-b border-gray-100 last:border-b-0"
          >
            <div className="font-medium text-[hsl(var(--gob-gray-900))]">
              {getLabel(item)}
            </div>
            {getDescription && (
              <div className="text-sm text-[hsl(var(--gob-gray-600))] mt-1">
                {getDescription(item)}
              </div>
            )}
          </button>
        ))
      ) : search.trim() ? (
        <div className="p-4 text-center text-gray-500">No results found</div>
      ) : (
        <div className="p-4 text-center text-gray-500">Start typing to search</div>
      )}
    </div>
  );

  return (
    <div ref={containerRef}>
      <label className="block text-sm font-medium text-[hsl(var(--gob-gray-700))] mb-2">
        {label} {required && <span className="text-[hsl(var(--gob-red))]">*</span>}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-12 border border-[hsl(var(--gob-gray-300))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gob-red))] focus:border-transparent text-[hsl(var(--gob-gray-900))]"
        />

        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Icon icon="mdi:loading" className="animate-spin text-xl text-[hsl(var(--gob-red))]" />
          </div>
        )}

        {search && !loading && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              onSearch('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <Icon icon="mdi:close-circle" className="text-xl" />
          </button>
        )}
      </div>

      {dropdownContent && createPortal(dropdownContent, document.body)}

      {!multiple && value && !noSpecify && (
        <div className="mt-3 p-3 bg-[hsl(var(--gob-gray-50))] rounded-lg border border-[hsl(var(--gob-gray-200))] text-sm">
          Selección: <strong>{getLabel(value as T)}</strong>
          {getDescription && (
            <div className="text-[hsl(var(--gob-gray-600))] mt-1">
              {getDescription(value as T)}
            </div>
          )}
        </div>
      )}

      {multiple && selectedLabels.length > 0 && (
        <div className="mt-4 p-4 bg-[hsl(var(--gob-gray-50))] rounded-lg border border-[hsl(var(--gob-gray-200))]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[hsl(var(--gob-gray-700))]">
              Entidades seleccionadas:
            </span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-sm text-[hsl(var(--gob-red))] hover:text-[hsl(var(--gob-red-dark))] underline"
            >
              Borrar todos
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(value as T[] ?? []).map((item) => (
              <span
                key={getKey(item)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[hsl(var(--gob-gray-300))] rounded-full text-sm"
              >
                {getLabel(item)}
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {allowNoSpecify && (
        <div className="mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={noSpecify}
              onChange={(e) => handleNoSpecifyChange(e.target.checked)}
              className="w-4 h-4 text-[hsl(var(--gob-red))] rounded focus:ring-[hsl(var(--gob-red))]"
            />
            <span className="text-sm text-[hsl(var(--gob-gray-700))]">
              No especificado
            </span>
          </label>
        </div>
      )}

      <input
        type="hidden"
        name={name}
        value={finalValue}
        required={required && !noSpecify && selectedLabels.length === 0}
      />
    </div>
  );
}