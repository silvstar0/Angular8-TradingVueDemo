import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WidgetScriptService {
  public appendScript(renderer: Renderer2, container: HTMLElement, scriptData: any, widgetParams: any) {
    const script = this.createScript(renderer, scriptData, widgetParams);

    renderer.appendChild(container, script);
    return script;
  }

  private createScript(renderer: Renderer2, scriptData: any, widgetParams: any) {
    const script = renderer.createElement('script');

    script.type = scriptData.type || 'text/javascript';
    script.src = scriptData.src;
    script.text = JSON.stringify(widgetParams);

    return script;
  }
}
