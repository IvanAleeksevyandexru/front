import  {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
  Injector,
  Renderer2,
  RendererFactory2,
  Type,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private injector: Injector;
  private renderer: Renderer2;

  constructor(private cfr: ComponentFactoryResolver,
              private rendererFactory: RendererFactory2,
              private appRef: ApplicationRef) {
    this.renderer = rendererFactory.createRenderer(null, null)
  }

  public openModal<T>(modalComponent: Type<any>, modalParameters?: any): Observable<T> {
    const modalResult = new Subject<T>();

    const componentFactory = this.cfr.resolveComponentFactory(modalComponent)
    const modalContainer = document.getElementById('modal-container');
    const modalRootNode = this.renderer.createElement('div');
    this.renderer.addClass(modalRootNode, 'modal-overlay');
    modalContainer.appendChild(modalRootNode);

    const componentRef = componentFactory.create(this.injector, [], modalRootNode);

    Object.assign(componentRef.instance, modalParameters);
    this.appRef.attachView(componentRef.hostView);
    componentRef.changeDetectorRef.detectChanges();

    componentRef.instance['detachView'] = (data: any) => {
      this.appRef.detachView(componentRef.hostView);
      modalResult.next(data);
    };

    return modalResult.asObservable();
  }

  public registerInjector(injector: Injector): void {
    this.injector = injector;
  }
}
