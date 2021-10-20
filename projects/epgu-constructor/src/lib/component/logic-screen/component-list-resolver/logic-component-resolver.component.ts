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

import { LogicComponents } from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { BehaviorSubject } from 'rxjs';
import {
  ScreenComponentTypes,
  ComponentTypes,
  LOGIC_SCREEN_COMPONENTS,
} from './logic-component-resolver.const';
import { LogicScreenComponentTypes } from './logic-screen-component-types';

@Component({
  selector: 'epgu-constructor-logic-component-resolver',
  templateUrl: './logic-component-resolver.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class LogicComponentResolverComponent implements AfterViewInit {
  @ViewChild('componentContainer', { read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @Input() componentDto: LogicComponents;

  componentRef: ComponentRef<ScreenComponentTypes>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    const cmpType = this.componentDto.type as LogicScreenComponentTypes;
    this.createComponent(cmpType);
  }

  private createComponent(cmpType: LogicScreenComponentTypes): void {
    const component = this.getComponentByType(cmpType);

    if (!component) {
      this.handleComponentError(cmpType);
    }

    const componentFactory: ComponentFactory<ScreenComponentTypes> = this.componentFactoryResolver.resolveComponentFactory(
      component,
    );
    this.componentRef = this.componentContainer.createComponent(componentFactory);
    this.componentRef.instance.hasLoaded = new BehaviorSubject(false);
    this.componentRef.instance.componentDto = this.componentDto;
    this.cdr.detectChanges();
  }

  private getComponentByType(cmpType: ComponentTypes): Type<ScreenComponentTypes> {
    return LOGIC_SCREEN_COMPONENTS[cmpType];
  }

  private handleComponentError(cmpType: ComponentTypes): never {
    throw new Error(
      `We cant find component for this component type: ${cmpType} for screen type: LogicScreen`,
    );
  }
}
