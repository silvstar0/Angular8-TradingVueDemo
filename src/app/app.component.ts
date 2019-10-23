import { untilDestroyed } from 'ngx-take-until-destroy';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageKeys, IColumn, IWidget, IWorkspace } from '@lib/models';

import { StorageService, WidgetDataService, WidgetBarService, WorkspaceService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  public workspace: IWorkspace;
  public columns: IColumn[];
  public columnDataset: any[];
  
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

  private _maxWidgetZindex: number;

  public ngOnInit() {
    this.activeWorkspaceIndex = 0;
    const widgets = this._widgetBarSvc.widgetBarValue;
    this._maxWidgetZindex = Math.max(
      ...widgets.map(c => c.zIndex)
    );
    
    this.workspaceSvc.activeWorkspace.pipe(untilDestroyed(this)).subscribe(worksp => {
      this.columns = this._storageSvc.get(StorageKeys.columns) || this._defaultColumns.map(c => ({ ...c, id: +`${worksp.id}${c.id}` }));

      this.columns = this.columns.map(c => ({ ...c, cards: widgets.filter(widget => widget.columnId === c.id && widget.inDashboard)}));
      this.workspace = {...worksp, column: this.columns.find(c => c.workspaceId === worksp.id)};
      this.columnDataset = this._widgetDataSvc.data ? this._widgetDataSvc.data.find(d => d.columnId === this.workspace.column.id) : undefined;
    });

    this.workspaceSvc.initActiveWorkspace(this.activeWorkspaceIndex);
  }

  public ngOnDestroy() {}

  public selectChart(widget: IWidget) {
    this._maxWidgetZindex += 1;
    widget.zIndex = this._maxWidgetZindex;

    this.workspace.column.cards.push(this._widgetBarSvc.addComponentToWidget(widget));
  }

  public increaseWidgetZindex({ index }) {
    const cardToUpdate = this.workspace.column.cards[index];
    this._maxWidgetZindex += 1;
    cardToUpdate.zIndex = this._maxWidgetZindex;

    this._widgetBarSvc.updateWidget(cardToUpdate);
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
