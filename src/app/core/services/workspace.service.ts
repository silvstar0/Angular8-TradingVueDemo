import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { StorageService } from './storage.service';
import { StorageKeys, IWorkspace } from '@lib/models';


@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  
  public activeIndex: number;
  public workspaces = this._storageSvc.get(StorageKeys.workspaces) || [{ id: 1, title: 'Default Workspace' }];
  private _activeWorkspace$ = new Subject<IWorkspace>();
  
  public setActiveWorkspace(workspace: IWorkspace) {
    this._activeWorkspace$.next(workspace);
  }

  public get activeWorkspace(): Observable<IWorkspace> {
    return this._activeWorkspace$ as Observable<IWorkspace>;
  }


  public get newWorkspaceId(): number  {
    return this.workspaces[this.workspaces.length - 1].id + 1;
  }

  constructor(
    private _storageSvc: StorageService,
  ) {}

  public initActiveWorkspace(index: number) {
    this.setActiveWorkspace(this.workspaces[index]);
  }

  public updateWorkspace({ columns, ...value }: IWorkspace) {
    let draftWorkspaces = this.workspaces.map(workspace => workspace.id === value.id ? value : workspace);

    this._storageSvc.set(StorageKeys.workspaces, draftWorkspaces);
  }

  public addWorkspace({ columns, ...value }: IWorkspace) {
    this.workspaces.push(value);

    this._storageSvc.set(StorageKeys.workspaces, this.workspaces);
  }

  public removeWorkspace({ columns, ...value }: IWorkspace) {
    const existWidgetIndex = this.workspaces.findIndex(w => w.id === value.id);
    this.workspaces.splice(existWidgetIndex, 1);

    this._storageSvc.set(StorageKeys.widgetBar, this.workspaces);
  }
}
