export interface IWidget {
  id: number;
  title: string;
  cols: number;
  rows: number;
  component: any;
  type: string;
  drawDataset: any;
  pinned: boolean;
  columnId?: number;
  isCustom?: boolean;
  inDashboard: boolean;
};
