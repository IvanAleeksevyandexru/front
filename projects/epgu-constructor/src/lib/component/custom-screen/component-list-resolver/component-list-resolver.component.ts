import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnChanges,
  SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntil, tap, subscribeOn } from 'rxjs/operators';
import { asyncScheduler } from 'rxjs';
import { ScreenTypes } from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../screen/screen.service';
import {
  ScreenComponentTypes,
  ComponentTypes,
  CUSTOM_SCREEN_COMPONENTS,
} from './component-list-resolver.const';

@Component({
  selector: 'epgu-constructor-component-list-resolver',
  templateUrl: './component-list-resolver.component.html',
  styleUrls: ['./component-list-resolver.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ComponentListResolverComponent implements AfterViewInit, OnChanges {
  @ViewChild('componentContainer', { read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @Input() componentIndex = 0;
  @Input() componentsGroupIndex = 0;
  @Input() componentType: ComponentTypes;
  @Input() limit?: number;
  componentRef: ComponentRef<ScreenComponentTypes>;

  constructor(
    private screenService: ScreenService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private ngUnsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.componentRef && (changes.componentsGroupIndex || changes.componentIndex)) {
      this.componentRef.instance.componentIndex = this.componentIndex;
      this.componentRef.instance.componentsGroupIndex = this.componentsGroupIndex;
      this.componentRef.instance.limit = this.limit;
    }
  }

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

  private destroyComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  private createComponent(cmpType: ComponentTypes, screenType: ScreenTypes): void {
    const component = this.getComponentByType(cmpType);

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
    this.componentRef.instance.limit = this.limit;
  }

  private getComponentByType(cmpType: ComponentTypes): Type<ScreenComponentTypes> {
    return CUSTOM_SCREEN_COMPONENTS[cmpType];
  }

  private handleComponentError(cmpType: ComponentTypes, screenType: ScreenTypes): never {
    throw new Error(
      `We cant find component for this component type: ${cmpType} for screen type: ${screenType}`,
    );
  }
}
