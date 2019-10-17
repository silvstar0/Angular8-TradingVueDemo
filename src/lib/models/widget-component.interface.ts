import { IWidget } from './widget.interface';

export interface IWidgetComponent {
  drawDataset: any;
  data: any;
  widget: IWidget;
  init: (data?: any) => void;
}
