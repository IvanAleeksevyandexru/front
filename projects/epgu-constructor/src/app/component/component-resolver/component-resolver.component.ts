import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntil, tap, subscribeOn } from 'rxjs/operators';
import { asyncScheduler } from 'rxjs';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../screen/screen.service';
import {
  ScreenComponentTypes,
  ComponentTypes,
  UNIQUE_SCREEN_COMPONENTS,
  CUSTOM_SCREEN_COMPONENTS,
} from './component-resolver.const';
import { ScreenTypes } from '../../screen/screen.types';

@Component({
  selector: 'epgu-constructor-component-resolver',
  templateUrl: './component-resolver.component.html',
  styleUrls: ['./component-resolver.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ComponentResolverComponent implements AfterViewInit {
  @ViewChild('componentContainer', { read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @Input() componentIndex = 0;
  @Input() componentsGroupIndex = 0;
  @Input() componentType: ComponentTypes;
  componentRef: ComponentRef<ScreenComponentTypes>;

  constructor(
    private screenService: ScreenService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private ngUnsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.screenService.display$
      .pipe(
        tap(() => this.destroyComponent()),
        subscribeOn(asyncScheduler), // fix dirty checked errors
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(({ components, type: screenType }) => {
        const cmpType =
          this.componentType ?? (components[this.componentIndex].type as ComponentTypes);
        this.createComponent(cmpType, screenType);
        this.cdr.detectChanges();
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
      this.handleComponentError(cmpType, screenType);
    }

    const componentFactory: ComponentFactory<ScreenComponentTypes> = this.componentFactoryResolver.resolveComponentFactory(
      component,
    );
    this.componentRef = this.componentContainer.createComponent(componentFactory);

    // @ts-ignore
    this.componentRef.instance.componentIndex = this.componentIndex;
    // @ts-ignore
    this.componentRef.instance.componentsGroupIndex = this.componentsGroupIndex;
  }

  getComponentByType(cmpType: ComponentTypes, screenType: ScreenTypes): Type<ScreenComponentTypes> {
    if (screenType === ScreenTypes.CUSTOM || screenType === ScreenTypes.REPEATABLE) {
      return CUSTOM_SCREEN_COMPONENTS[cmpType];
    }
    if (screenType === ScreenTypes.UNIQUE) {
      return UNIQUE_SCREEN_COMPONENTS[cmpType];
    }
    return null;
  }

  private handleComponentError(cmpType: ComponentTypes, screenType: ScreenTypes): never {
    throw new Error(
      `We cant find component for this component type: ${cmpType} for screen type: ${screenType}`,
    );
  }
}
