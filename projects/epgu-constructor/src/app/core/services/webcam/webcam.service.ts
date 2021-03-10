import { ComponentRef, ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { WebcamEvents } from '../../../shared/components/webcam-shoot/webcamevents';
import {
  WebcamShootComponent
} from '../../../shared/components/webcam-shoot/webcam-shoot.component';
import { catchError, map } from 'rxjs/operators';
import { from, Observable, throwError } from 'rxjs';

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
  close(): void {
    this.containerRef.destroy();
  }

  isWebcamAllowed(): Observable<boolean> {
    return from(navigator?.mediaDevices?.getUserMedia({ video: true }) || [false])
      .pipe(
        catchError((e) => {
          // eslint-disable-next-line no-restricted-syntax
          console.info('Camera error', e);
          return throwError(false);
        }),
        map((stream) => {
          if (stream instanceof MediaStream) {
            stream.getTracks().forEach((track) => track.stop());
          }
          return Boolean(stream);
        })
      );
  }
}
