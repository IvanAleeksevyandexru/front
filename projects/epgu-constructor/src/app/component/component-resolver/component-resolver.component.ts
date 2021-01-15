import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { delay, takeUntil, tap } from 'rxjs/operators';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../screen/screen.service';
import {
  COMPONENT_SCREEN_COMPONENTS,
  ComponentScreenComponent,
  ComponentTypes,
} from './component-resolver.const';

@Component({
  selector: 'epgu-constructor-component-resolver',
  templateUrl: './component-resolver.component.html',
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
  providers: [UnsubscribeService],
})
export class ComponentResolverComponent implements AfterViewInit {
  @ViewChild('componentContainer', { read: ViewContainerRef }) componentContainer: ViewContainerRef;
  componentRef: ComponentRef<ComponentScreenComponent>;

  constructor(
    private screenService: ScreenService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngAfterViewInit(): void {
    this.screenService.display$
      .pipe(
        tap(() => this.destroyComponent()),
        delay(0),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(({ components }) => {
        components.forEach((cmp) => this.createComponent(cmp.type as ComponentTypes));
      });
  }

  destroyComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  createComponent(cmpType: ComponentTypes): void {
    const component = this.getComponentByType(cmpType);

    if (!component) {
      this.handleComponentError(cmpType);
    }

    const componentFactory: ComponentFactory<ComponentScreenComponent> = this.componentFactoryResolver.resolveComponentFactory(
      component,
    );
    this.componentRef = this.componentContainer.createComponent(componentFactory);
  }

  getComponentByType(cmpType: ComponentTypes): Type<ComponentScreenComponent> {
    return COMPONENT_SCREEN_COMPONENTS[cmpType];
  }

  private handleComponentError(cmpType: ComponentTypes): never {
    throw new Error(`We cant find component for this component type: ${cmpType}`);
  }
}
