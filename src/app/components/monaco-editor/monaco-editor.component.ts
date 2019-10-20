import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IWidget, IWidgetComponent } from '@lib/models';

@Component({
  selector: 'app-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.scss'],
})
export class MonacoEditorComponent implements IWidgetComponent, OnInit {
  @Input()
  public drawDataset: any;

  @Input()
  public data: any;

  @Input()
  public widget: IWidget;

  @Output()
  public symbolChanged = new EventEmitter<string>();

  public width: number;
  public height: number;

  public editorOptions = {
    theme: 'vs-dark',
    selectOnLineNumbers: 'true',
  };

  public code = '';

  public ngOnInit() {
    this.init();
  }

  public init(resetData?: any) {
    this.width = resetData && resetData.width
      ? Math.floor(resetData.width)
      : this.drawDataset && this.drawDataset.width && Math.floor(this.drawDataset.width) || 400;
    this.height = resetData && resetData.height
      ? Math.floor(resetData.height)
      : this.drawDataset && this.drawDataset.height && Math.floor(this.drawDataset.height) || 600;

  }

  onKeyUp() {
    const symbol: string = this.code.replace(/(\r\n|\n|\r)/gm, '');
    this.symbolChanged.emit(symbol);
  }
}
