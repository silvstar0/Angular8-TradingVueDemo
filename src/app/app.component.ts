import { Component, ViewChildren, QueryList, OnInit, ViewContainerRef } from '@angular/core';
import { StorageKeys, IColumn, IWidget, IWorkspace } from '@lib/models';

import { StorageService, WidgetDataService, WidgetBarService, WorkspaceService } from './core/services';
import { DashboardColumnContainer } from './containers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChildren('columnContainer', { read: ViewContainerRef })
  public columnContainers: QueryList<ViewContainerRef>;

  public widgetData = this._widgetDataSvc.data;
  public workspace: IWorkspace;

  public columns: IColumn[];
  public activeColumnIndex: number;

  public get saveFormattedColumns(): IColumn[] {
    return this.columns.reduce((prev, curr) => [...prev, { id: curr.id }], []);
  }

  public get activeWorkspaceIndex(): number {
    return this.workspaceSvc.activeIndex;
  }

  public set activeWorkspaceIndex(i: number) {
    this.workspaceSvc.activeIndex = i;
  }

  private get _defaultColumns(): IColumn[] {
    return [{ id: 1, workspaceId: 1, width: 33,  cards: [] }, { id: 2, workspaceId: 1, width: 66, cards: [] }];
  }

  constructor(
    public workspaceSvc: WorkspaceService,
    private _storageSvc: StorageService,
    private _widgetDataSvc: WidgetDataService,
    private _widgetBarSvc: WidgetBarService,
  ) {}


  public ngOnInit() {
    this.activeColumnIndex = 1;
    this.activeWorkspaceIndex = 0;
    
    this.workspaceSvc.activeWorkspace.subscribe(worksp => {
      this.columns = this._storageSvc.get(StorageKeys.columns) || this._defaultColumns.map(c => ({ ...c, id: +`${worksp.id}${c.id}` }));
      this.columns = this.columns.map(c => ({ ...c, cards: this._widgetBarSvc.widgetBarValue.filter(widget => widget.columnId === c.id && widget.inDashboard) }));
      this.workspace = {...worksp, columns: this.columns.filter(c => c.workspaceId === worksp.id)};
    });

    this.workspaceSvc.initActiveWorkspace(this.activeWorkspaceIndex);
  }

  public getWidgetsDataByColumnId(columnId): any[] {
    return this.widgetData ? this.widgetData.find(d => d.columnId === columnId) : undefined;
  }

  public selectChart(widget: IWidget) {
    if (this.activeColumnIndex === undefined) {
      return;
    }

    const column = this.workspace.columns[this.activeColumnIndex];
    column.cards.push(this._widgetBarSvc.addComponentToWidget(widget));
  }

  public calcColumnSize(size) {
    const [ left, right ] = this.columns.filter(c => c.workspaceId === this.workspace.id);
    const draftSizes = {
      left: size.left >= 50 ? 50 : size.left,
      right: size.left >= 50 ? 50 : size.right,
    };

    left.width = draftSizes.left;
    right.width = draftSizes.right;

    this._storageSvc.set(StorageKeys.columns, this.columns.map(c => ({ ...c, cards: undefined })));
    this.resizeColumns();
  }

  public resizeColumns() {
    this.columnContainers.forEach(col => {
      const data = (col as any)._data.componentView.component as Partial<DashboardColumnContainer>;
      data.options.api.resize();
    });
  }

  public selectWorkspace({ workspace, index }) {
    const columns = this.columns.filter(c => c.workspaceId === workspace.id);
    this.activeWorkspaceIndex = index;
    this.workspace = { ...workspace, columns: columns.length ? columns : this._defaultColumns };
  }

  public addWorkspace() {
    const id = this.workspaceSvc.newWorkspaceId;
    const workspace = { id, title:  `New Workspace (${id})`};
    this.columns = [...this.columns, ...this._defaultColumns.map(c => ({ ...c, id: +`${id}${c.id}`, workspaceId: id }))];
    this._storageSvc.set(StorageKeys.columns, this.columns.map(c => ({ ...c, cards: undefined })));

    this.workspaceSvc.addWorkspace(workspace);
    this.activeWorkspaceIndex = this.workspaceSvc.workspaces.length - 1;

    this.workspaceSvc.initActiveWorkspace(this.activeWorkspaceIndex);
  }

  public removeWorkspace() {

  }
}
