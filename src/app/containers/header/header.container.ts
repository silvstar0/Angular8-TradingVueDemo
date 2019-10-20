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
  public selectChart = new EventEmitter<IWidget>();
}
