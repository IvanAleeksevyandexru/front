import { ChangeDetectionStrategy, Component, Injector, AfterViewInit } from '@angular/core';
import { ValidationShowOn } from '@epgu/epgu-lib';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { EmployeeHistoryMonthsService } from '../../../unique-screen/components/employee-history/services/employee-history.months.service';

@Component({
  selector: 'epgu-constructor-month-picker',
  templateUrl: './month-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class MonthPickerComponent extends AbstractComponentListItemComponent
  implements AfterViewInit {
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  align = 'left';

  constructor(public injector: Injector, public monthsService: EmployeeHistoryMonthsService) {
    super(injector);
  }

  ngAfterViewInit(): void {
    const component = this.control?.value;
    if (component) {
      const { attrs } = component;
      this.monthsService.years = attrs?.years;
      this.monthsService.isNonStop = attrs?.nonStop;
      this.monthsService.initSettings().then(() => this.cdr.markForCheck());
    }
  }
}
