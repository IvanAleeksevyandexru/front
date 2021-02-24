import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
  Renderer2,
  RendererFactory2,
  Type,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { HelperService } from 'epgu-lib';

@Injectable()
export class ModalService {
  private injector: Injector;
  private renderer: Renderer2 = this.rendererFactory.createRenderer(null, null);

  constructor(
    private cfr: ComponentFactoryResolver,
    private rendererFactory: RendererFactory2,
    private appRef: ApplicationRef,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public openModal<T, K = any>(modalComponent: Type<any>, modalParameters?: K): Observable<T> {
    const componentRef = this.createModal(modalComponent, modalParameters);
    const modalResult = new Subject<T>();

    componentRef.instance['detachView'] = (data): void => {
      this.appRef.detachView(componentRef.hostView);
      modalResult.next(data);
    };

    return modalResult.asObservable().pipe(take(1));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public createModal<R, K = any>(modalComponent: Type<R>, modalParameters?: K): ComponentRef<R> {
    if (HelperService.isTouchDevice()) {
      document.body.style.overflow = 'hidden';
      const screenResolver = document.querySelector<HTMLElement>(
        'epgu-constructor-screen-resolver',
      );

      if (screenResolver) {
        screenResolver.style.visibility = 'hidden';
      }
    }
    const componentFactory = this.cfr.resolveComponentFactory<R>(modalComponent);
    const modalContainer = document.getElementById('modal-container');
    const modalRootNode = this.renderer.createElement('div');
    this.renderer.addClass(modalRootNode, 'modal-overlay');
    modalContainer.appendChild(modalRootNode);

    const componentRef = componentFactory.create(this.injector, [], modalRootNode);

    Object.assign(componentRef.instance, modalParameters);
    this.appRef.attachView(componentRef.hostView);
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }

  public registerInjector(injector: Injector): void {
    this.injector = injector;
  }
}
