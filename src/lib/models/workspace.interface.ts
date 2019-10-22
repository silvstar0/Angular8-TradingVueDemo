import { IColumn } from './column.interface';

export interface IWorkspace {
  id: number;
  title: string;
  columns?: IColumn[];
};
