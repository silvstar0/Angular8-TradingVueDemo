import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IWidget, IWidgetComponent } from '@lib/models';

@Component({
  selector: 'app-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.scss'],
})
export class MonacoEditorComponent implements IWidgetComponent, OnInit {
  public canShow = false;

  @Input()
  public autosize = false;

  @Input()
  public drawDataset: any;

  @Input()
  public data: any;

  @Input()
  public widget: IWidget;

  @Output()
  public readonly symbolChanged = new EventEmitter<string>();

  public width = 400;
  public height = 600;

  public editorOptions = {
    theme: 'vs-dark',
    selectOnLineNumbers: true,
    automaticLayout: true,
  };

  public code = '';

  constructor() {}

  public ngOnInit() {
    setTimeout(() => this.canShow = true);
  }

  public onResize = (_?: any) => {}

  public onKeyUp() {
    const symbol: string = this.code.replace(/(\r\n|\n|\r)/gm, '');
    this.symbolChanged.emit(symbol);
  }
}
