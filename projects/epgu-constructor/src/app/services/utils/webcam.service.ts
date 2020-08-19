import {ComponentRef, ApplicationRef, ComponentFactoryResolver, Inject, Injectable, Injector} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ComponentPortal, DomPortalOutlet} from '@angular/cdk/portal';
import {WebcamShotComponent} from '../../modules/custom/components/webcam-shot/webcam-shot.component';
import {WebcamEvents} from './webcamevents';

@Injectable({
  providedIn: 'root'
})
export class WebcamService {
  private loadComponent: ComponentPortal<WebcamShotComponent>;
  private containerRef: ComponentRef<WebcamShotComponent>;

  constructor(
    private appRef: ApplicationRef,
    private _CFR: ComponentFactoryResolver,
    private _injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.loadComponent = new ComponentPortal(WebcamShotComponent);
  }

  /**
   * Open chat on site
   */
  open(): WebcamEvents {
    const hostElement = this.document.body;

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
