export interface IWidget {
  id: number;
  title: string;
  cols: number;
  rows: number;
  component: any;
  type: string;
  drawDataset: any;
  pinned: boolean;
  inDashboard: boolean;
  zIndex: number;
  columnId?: number;
  isCustom?: boolean;
};
