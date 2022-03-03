import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Input,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { LogicComponents } from '@epgu/epgu-constructor-types';
import { LoggerService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
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

  constructor(private cdr: ChangeDetectorRef, private logger: LoggerService) {}

  ngAfterViewInit(): void {
    const cmpType = this.componentDto.type as LogicScreenComponentTypes;
    this.createComponent(cmpType);
  }

  private createComponent(cmpType: LogicScreenComponentTypes): void {
    const component = this.getComponentByType(cmpType);

    if (!component) {
      this.handleComponentNotSupported(cmpType);
      return;
    }

    this.componentRef = this.componentContainer.createComponent(component);
    this.componentRef.instance.hasLoaded = new BehaviorSubject(false);
    this.componentRef.instance.componentDto = this.componentDto;
    this.cdr.detectChanges();
  }

  private getComponentByType(cmpType: ComponentTypes): Type<ScreenComponentTypes> {
    return LOGIC_SCREEN_COMPONENTS[cmpType];
  }

  private handleComponentNotSupported(cmpType: ComponentTypes): void {
    this.logger.log([
      `We cant find component for this component type: ${cmpType} for screen type: LogicScreen.
      It's not supported yet or it's backend logic component`,
    ]);
  }
}
