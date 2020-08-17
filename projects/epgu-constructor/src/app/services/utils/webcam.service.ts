import {ComponentRef, ApplicationRef, ComponentFactoryResolver, Inject, Injectable, Injector} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ComponentPortal, DomPortalOutlet} from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class WebcamService {
  //private loadComponent: ComponentPortal<WebcamComponent>;
  //private containerRef: ComponentRef<WebcamComponent>;

  constructor(
    private appRef: ApplicationRef,
    private _CFR: ComponentFactoryResolver,
    private _injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {
    // this.loadComponent = new ComponentPortal(WebcamComponent);
  }

  /**
   * Open chat on site
   */
  // open(): WebcamEvents {
  //   const hostElement = this.document.body;
  //
  //   const chatEvents = new WebcamEvents(); // Create an object to pass modal methods to target component
  //   const injector = Injector.create({
  //     providers: [{ provide: WebcamEvents, useValue: chatEvents }],
  //     parent: this._injector,
  //   });
  //
  //   const hostPortal = new DomPortalOutlet(
  //     hostElement,
  //     this._CFR,
  //     this.appRef,
  //     injector
  //   );
  //   this.containerRef = hostPortal.attach(this.loadComponent);
  //   return chatEvents;
  // }
  //
  // /**
  //  * Close chat
  //  */
  // close() {
  //   this.containerRef.destroy();
  // }
}
