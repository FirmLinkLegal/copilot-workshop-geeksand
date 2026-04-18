export type ColumnId = 'todo' | 'in-progress' | 'complete';

export interface Card {
  id: string;
  title: string;
  body: string;
  columnId: ColumnId;
  order: number;
  createdAt: number;
}

export interface Board {
  cards: Card[];
}

export interface ColumnConfig {
  id: ColumnId;
  label: string;
}

export const COLUMNS: ColumnConfig[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'complete', label: 'Complete' },
];
