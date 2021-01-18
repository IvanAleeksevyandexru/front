import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { delay, takeUntil, tap } from 'rxjs/operators';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../screen/screen.service';
import {
  COMPONENT_SCREEN_COMPONENTS,
  ScreenComponentTypes,
  ComponentTypes,
  UNIQUE_SCREEN_COMPONENTS,
} from './component-resolver.const';
import { ScreenTypes } from '../../screen/screen.types';

@Component({
  selector: 'epgu-constructor-component-resolver',
  templateUrl: './component-resolver.component.html',
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
  providers: [UnsubscribeService],
})
export class ComponentResolverComponent implements AfterViewInit {
  @ViewChild('componentContainer', { read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @Input() componentIndex = 0;
  componentRef: ComponentRef<ScreenComponentTypes>;

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
      .subscribe(({ components, type: screenType }) => {
        const cmpType = components[this.componentIndex].type as ComponentTypes;
        this.createComponent(cmpType, screenType);
      });
  }

  destroyComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  createComponent(cmpType: ComponentTypes, screenType: ScreenTypes): void {
    const component = this.getComponentByType(cmpType, screenType);

    if (!component) {
      this.handleComponentError(cmpType);
    }

    const componentFactory: ComponentFactory<ScreenComponentTypes> = this.componentFactoryResolver.resolveComponentFactory(
      component,
    );
    this.componentRef = this.componentContainer.createComponent(componentFactory);
  }

  getComponentByType(cmpType: ComponentTypes, screenType: ScreenTypes): Type<ScreenComponentTypes> {
    switch (screenType) {
      case ScreenTypes.COMPONENT:
        return COMPONENT_SCREEN_COMPONENTS[cmpType];
      case ScreenTypes.UNIQUE:
        return UNIQUE_SCREEN_COMPONENTS[cmpType];
      default:
        return null;
    }
  }

  private handleComponentError(cmpType: ComponentTypes): never {
    throw new Error(`We cant find component for this component type: ${cmpType}`);
  }
}
