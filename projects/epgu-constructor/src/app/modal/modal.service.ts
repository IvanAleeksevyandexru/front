import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
  Injector,
  Renderer2,
  RendererFactory2,
  Type
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
    if (HelperService.isTouchDevice()) {
      document.body.style.overflow = 'hidden';
      const screenResolver = document.querySelector<HTMLElement>(
        'epgu-constructor-screen-resolver',
      );

      if (screenResolver) {
        screenResolver.style.visibility = 'hidden';
      }
    }

    const modalResult = new Subject<T>();

    const componentFactory = this.cfr.resolveComponentFactory(modalComponent);
    const modalContainer = document.getElementById('modal-container');
    const modalRootNode = this.renderer.createElement('div');
    this.renderer.addClass(modalRootNode, 'modal-overlay');
    modalContainer.appendChild(modalRootNode);

    const componentRef = componentFactory.create(this.injector, [], modalRootNode);

    Object.assign(componentRef.instance, modalParameters);
    this.appRef.attachView(componentRef.hostView);
    componentRef.changeDetectorRef.detectChanges();

    componentRef.instance['detachView'] = (data): void => {
      this.appRef.detachView(componentRef.hostView);
      modalResult.next(data);
    };

    return modalResult.asObservable().pipe(take(1));
  }

  public registerInjector(injector: Injector): void {
    this.injector = injector;
  }
}
