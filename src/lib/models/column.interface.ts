import { IColumnCard } from './column-card.interface';

export interface IColumn {
  id: number;
  cards: IColumnCard[];
}
