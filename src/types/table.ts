export type ColumnType = 'text' | 'boolean' | 'buttons';

export interface ColumnButton<T> {
  icon: string;
  action: string;
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