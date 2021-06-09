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
import { takeUntil, tap, subscribeOn, filter } from 'rxjs/operators';
import { asyncScheduler } from 'rxjs';
import { ScreenTypes } from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../../screen/screen.service';
import {
  ScreenComponentTypes,
  ComponentTypes,
  UNIQUE_SCREEN_COMPONENTS,
} from './component-unique-resolver.const';

@Component({
  selector: 'epgu-constructor-component-unique-resolver',
  templateUrl: './component-unique-resolver.component.html',
  styleUrls: ['./component-unique-resolver.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ComponentUniqueResolverComponent implements AfterViewInit, OnChanges {
  @ViewChild('componentContainer', { read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @Input() componentIndex = 0;
  componentRef: ComponentRef<ScreenComponentTypes>;

  constructor(
    private screenService: ScreenService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private ngUnsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.componentRef && (changes.componentsGroupIndex || changes.componentIndex)) {
      // @ts-ignore
      this.componentRef.instance.componentIndex = this.componentIndex;
    }
  }

  ngAfterViewInit(): void {
    this.screenService.display$
      .pipe(
        filter(() => !this.screenService.isTheSameScreenWithErrors),
        tap(() => this.destroyComponent()),
        subscribeOn(asyncScheduler), // fix dirty checked errors
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(({ components, type: screenType }) => {
        const cmpType = components[this.componentIndex].type as ComponentTypes;
        this.createComponent(cmpType, screenType);
        this.cdr.detectChanges();
      });
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
  }

  private getComponentByType(cmpType: ComponentTypes): Type<ScreenComponentTypes> {
    return UNIQUE_SCREEN_COMPONENTS[cmpType];
  }

  private destroyComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  private handleComponentError(cmpType: ComponentTypes, screenType: ScreenTypes): never {
    throw new Error(
      `We cant find component for this component type: ${cmpType} for screen type: ${screenType}`,
    );
  }
}
