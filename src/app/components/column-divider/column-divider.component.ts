import { Component, AfterViewInit, Renderer2, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-column-divider',
  templateUrl: './column-divider.component.html',
  styleUrls: ['./column-divider.component.scss'],
})
export class ColumnDividerComponent implements OnInit, AfterViewInit {
  @Output()
  public divide = new EventEmitter();

  public _contentWidth = document.body.clientWidth - 30;

  constructor(
    private _renderer: Renderer2,
    private _element: ElementRef,
  ) { }

  public ngOnInit() {
    this._renderer.listen(window, 'resize', () => {
      this._contentWidth = document.body.clientWidth - 30;
    });
  }

  public ngAfterViewInit() {
    const el = this._renderer.createElement('div');
    this._renderer.addClass(el, 'column-divider');
    this._renderer.appendChild(this._element.nativeElement, el);

    this._renderer.listen(el, 'mousedown', this.onResizeStart(el));
  }

  public onResizeStart = divider => event => {
    const existDividerCoords = this.getElementCoords(event.target);
    const shiftX = event.pageX - existDividerCoords.left;
    
    const draftLine = this.createDraftLine(divider);

    const moveAt = (e) => {
      const left = e.pageX - shiftX - 10;
      draftLine.style.left = (left > this._contentWidth ? this._contentWidth : left) + 'px';
      draftLine.style.top = existDividerCoords.top + 'px';
    }

    moveAt(event);

    document.onmousemove = function(e) {
      moveAt(e);
    };

    document.body.appendChild(draftLine);
    document.body.appendChild(this.createBackdrop(draftLine, event.target));
  }

  private createBackdrop(draftDivider: HTMLElement, existingStaticDivider: HTMLElement) {
    const backdrop = document.createElement('div');

    backdrop.style.position = 'absolute';
    backdrop.style.zIndex = '99999';
    backdrop.style.width = '100%';
    backdrop.style.height = '100%';
    backdrop.style.top = '0';
    backdrop.style.left = '0';

    this._renderer.listen(backdrop, 'mouseup', () => {
      document.onmousemove = null;
      draftDivider.onmouseup = null;
      backdrop.remove();
      existingStaticDivider.remove();

      this._renderer.listen(draftDivider, 'mousedown', this.onResizeStart(draftDivider));

      const coords = this.getElementCoords(draftDivider);
      const pixelsPerPercent = this._contentWidth / 100;

      const left = coords.left / pixelsPerPercent;
      const right = (this._contentWidth - coords.left ) / pixelsPerPercent;

      this.divide.emit({ left, right });
      
      draftDivider.style.position = 'static';
      this._renderer.appendChild(this._element.nativeElement, draftDivider);
    });

    return backdrop;
  }

  private getElementCoords(elem: HTMLElement) {
    const box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  }

  private createDraftLine(baseEl) {
    const draftLine = baseEl.cloneNode();
    draftLine.style.zIndex = 1000;
    draftLine.style.position = 'absolute';
    draftLine.style.height = baseEl.clientHeight + 'px';

    this._renderer.listen(draftLine, 'mouseup', () => {
      document.onmousemove = null;
      draftLine.onmouseup = null;
    });

    this._renderer.listen(draftLine, 'dragstart', () => false);

    return draftLine;
  }
}
