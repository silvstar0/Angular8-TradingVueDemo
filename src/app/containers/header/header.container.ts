import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.container.html',
  styleUrls: ['./header.container.scss'],
})
export class HeaderContainer {
  @Output()
  public selectChart = new EventEmitter<string>();

  @Output()
  public addColumn = new EventEmitter<string>();
}
