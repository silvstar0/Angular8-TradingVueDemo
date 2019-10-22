import { Component, Output, EventEmitter, Input } from '@angular/core';
import { IWidget } from '@lib/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.container.html',
  styleUrls: ['./header.container.scss'],
})
export class HeaderContainer {
  @Input()
  public columnId: number;

  @Output()
  public readonly selectChart = new EventEmitter<IWidget>();

  @Output()
  public readonly addWorkspace = new EventEmitter();

  @Output()
  public readonly removeWorkspace = new EventEmitter();

  @Output()
  public readonly selectWorkspace = new EventEmitter();
}
