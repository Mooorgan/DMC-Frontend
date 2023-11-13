export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  creator?: string;
  username?: string;
}

export type SortValue = 'ascending' | 'descending' | 'default';
