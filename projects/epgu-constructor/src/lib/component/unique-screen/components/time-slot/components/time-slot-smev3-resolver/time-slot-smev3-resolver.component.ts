import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { asyncScheduler } from 'rxjs';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { subscribeOn, takeUntil, tap } from 'rxjs/operators';
import { TIMESLOT_COMPONENTS, TimeSlotComponentTypes } from './time-slot-smev3-resolver.const';
import { TimeSlotSmev3StateService } from '../../services/smev3-state/time-slot-smev3-state.service';
import { TimeSlotsTypes } from '../../time-slot.const';

@Component({
  selector: 'epgu-constructor-time-slot-smev3-resolver',
  templateUrl: './time-slot-smev3-resolver.component.html',
  styleUrls: ['./time-slot-smev3-resolver.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class TimeSlotSmev3ResolverComponent implements AfterViewInit {
  @ViewChild('componentContainer', { read: ViewContainerRef }) componentContainer: ViewContainerRef;
  componentRef: ComponentRef<TimeSlotComponentTypes>;
  constructor(
    private smev3: TimeSlotSmev3StateService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private ngUnsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.smev3.type$
      .pipe(
        tap(() => this.destroyComponent()),
        subscribeOn(asyncScheduler),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((type: TimeSlotsTypes) => {
        this.createComponent(type);
        this.cdr.detectChanges();
      });
  }

  private createComponent(cmpType: TimeSlotsTypes): void {
    const component = this.getComponentByType(cmpType);

    if (!component) {
      this.handleComponentError(cmpType);
    }

    const componentFactory: ComponentFactory<TimeSlotComponentTypes> = this.componentFactoryResolver.resolveComponentFactory(
      component,
    );
    this.componentRef = this.componentContainer.createComponent(componentFactory);
  }

  private getComponentByType(cmpType: TimeSlotsTypes): Type<TimeSlotComponentTypes> {
    return TIMESLOT_COMPONENTS[cmpType];
  }

  private destroyComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  private handleComponentError(cmpType: TimeSlotsTypes): never {
    throw new Error(`[TimeSlot] We cant find component for this component type: ${cmpType}}`);
  }
}
