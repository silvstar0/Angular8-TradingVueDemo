import { IWidget } from './widget.interface';

export interface IColumn {
  id: number;
  workspaceId: number;
  width: number;
  cards: IWidget[];
}
