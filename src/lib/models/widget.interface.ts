import { IColumnCard } from './column-card.interface';

export interface IWidget {
  drawDataset: any;
  data: any;
  widget: IColumnCard;
  init: (data?: any) => void;
}
