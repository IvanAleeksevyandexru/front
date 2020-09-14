import { ComponentRef, ApplicationRef, ComponentFactoryResolver, Inject, Injectable, Injector } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { WebcamEvents } from '../../webcam/webcamevents';
import {
  WebcamShootComponent
} from '../../sub-components/webcam-shoot/webcam-shoot.component';

@Injectable()
export class WebcamService {
  private loadComponent: ComponentPortal<WebcamShootComponent>;
  private containerRef: ComponentRef<WebcamShootComponent>;

  constructor(
    private appRef: ApplicationRef,
    private _CFR: ComponentFactoryResolver,
    private _injector: Injector,
  ) {
    this.loadComponent = new ComponentPortal(WebcamShootComponent);
  }

  /**
   * Open chat on site
   */
  open(): WebcamEvents {
    const hostElement = window.document.body;

    const chatEvents = new WebcamEvents(); // Create an object to pass modal methods to target component
    const injector = Injector.create({
      providers: [{ provide: WebcamEvents, useValue: chatEvents }],
      parent: this._injector,
    });

    const hostPortal = new DomPortalOutlet(
      hostElement,
      this._CFR,
      this.appRef,
      injector
    );
    this.containerRef = hostPortal.attach(this.loadComponent);
    return chatEvents;
  }

  /**
   * Закрывает окно вебкамеры
   */
  close() {
    this.containerRef.destroy();
  }
}
