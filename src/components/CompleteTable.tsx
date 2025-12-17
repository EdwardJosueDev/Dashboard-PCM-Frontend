import { Icon } from '@iconify/react';
import React, { ChangeEvent } from 'react';

export interface SearchParams {
  limit: number;
  offset: number;
  q?: Record<string, unknown>;
}

export type ColumnType = 'text' | 'boolean' | 'buttons';

export interface ColumnButton<T> {
  icon: string;
  action: string;
  label?: string;
  disabled?: boolean | ((row: T) => boolean);
}

export interface Column<T> {
  header: string | React.ReactNode;
  field?: keyof T;
  type?: ColumnType;
  align?: 'left' | 'center' | 'right';
  buttons?: ColumnButton<T>[];
  render?: (row: T) => React.ReactNode;
}

export interface CompleteTableProps<T> {
  cols: Column<T>[];
  data: T[];
  total: number;
  limit: number;
  offset: number;
  onSearch: (params: SearchParams) => void;
  onAction: (action: string, row: T) => void;
  rowKey?: (row: T, index: number) => string;
  pageSizes?: number[];
}

export default function CompleteTable<T>({
  cols,
  data,
  total,
  limit,
  offset,
  onSearch,
  onAction,
  rowKey = (_row, index) => String(index),
  pageSizes = [10, 20, 50, 100],
}: CompleteTableProps<T>) {
  const handleLimitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    onSearch({ limit: newLimit, offset: 0 });
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  // Función para generar las páginas visibles con elipsis
  const generatePages = () => {
    const pages: (number | string)[] = [];

    // Más páginas visibles en desktop (max ~9-10 items), menos en mobile (~6-7)
    const maxVisible = window.innerWidth >= 640 ? 10 : 7; // sm: breakpoint de Tailwind

    if (totalPages <= maxVisible) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Siempre mostrar 1 y 2 al inicio si es posible
    pages.push(1);
    if (currentPage <= 4) {
      // Inicio: 1 2 3 4 ... totalPages
      for (let i = 2; i <= Math.min(5, totalPages); i++) pages.push(i);
      if (totalPages > 5) pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      // Final: 1 ... (total-4) ... total
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      // Medio: 1 ... (current-2 ... current+2) ... total
      pages.push('...');
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onSearch({ limit, offset: (page - 1) * limit });
  };

  return (
    <div className="h-full flex flex-col gap-4 mx-4 bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex-1 overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-800 border-collapse">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700 sticky top-0 z-10">
            <tr>
              {cols.map((col, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-3 border-b border-gray-200 ${col.align ? `text-${col.align}` : 'text-left'}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={rowKey(row, i)}
                className="bg-white border-b hover:bg-gray-50 transition-colors duration-150"
              >
                {cols.map((col, j) => (
                  <td
                    key={`${rowKey(row, i)}-${j}`}
                    className={`px-6 py-4 whitespace-nowrap border-b border-gray-200 ${col.align ? `text-${col.align}` : 'text-left'}`}
                  >
                    {col.render ? (
                      col.render(row)
                    ) : (
                      <>
                        {(!col.type || col.type === 'text') && col.field && (
                          <span>{String(row[col.field])}</span>
                        )}

                        {col.type === 'boolean' && col.field && (
                          <span className="font-medium">
                            {row[col.field] ? 'Sí' : 'No'}
                          </span>
                        )}

                        {col.type === 'buttons' && (
                          <div className="flex gap-2">
                            {col.buttons?.map((btn, k) => (
                              <button
                                key={`${btn.action}-${k}`}
                                onClick={() => onAction(btn.action, row)}
                                disabled={
                                  typeof btn.disabled === 'function'
                                    ? btn.disabled(row)
                                    : btn.disabled
                                }
                                className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                                aria-label={btn.label || btn.action}
                                title={btn.label || btn.action}
                              >
                                <Icon icon={btn.icon} className="w-5 h-5 text-gray-600" />
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="text-center py-4 text-gray-500">No se encontraron datos</div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-gray-50 text-sm text-gray-700 border-t border-gray-200 gap-4">
        <span className="text-center sm:text-left">
          Mostrando {offset + 1}–{Math.min(offset + limit, total)} de {total} resultados
        </span>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label className="flex items-center gap-2">
            Filas por página:
            <select
              value={limit}
              onChange={handleLimitChange}
              className="px-2 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          <nav className="flex items-center gap-1" aria-label="Paginación">
            {/* Anterior */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Anterior"
            >
              <span className="hidden sm:inline">Anterior</span>
              <span className="sm:hidden">&lt;</span>
            </button>

            {/* Páginas con elipsis */}
            {pages.map((page, idx) =>
              page === '...' ? (
                <span key={idx} className="px-3 py-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={idx}
                  onClick={() => goToPage(page as number)}
                  className={`relative px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 ${
                    page === currentPage ? 'text-blue-600 font-bold' : ''
                  }`}
                  aria-label={`Página ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                  {page === currentPage && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black mx-2" />
                  )}
                </button>
              )
            )}

            {/* Siguiente */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Siguiente"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <span className="sm:hidden">&gt;</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}