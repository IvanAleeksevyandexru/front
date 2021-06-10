import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { DatesHelperService, MonthYear, ValidationShowOn } from '@epgu/epgu-lib';
import { startWith, takeUntil } from 'rxjs/operators';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { EmployeeHistoryMonthsService } from '../../../unique-screen/components/employee-history/services/employee-history.months.service';

@Component({
  selector: 'epgu-constructor-month-picker',
  templateUrl: './month-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService, EmployeeHistoryMonthsService],
})
export class MonthPickerComponent extends AbstractComponentListItemComponent implements OnInit {
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  align = 'left';

  maxMonth?: MonthYear;
  minMonth?: MonthYear;

  constructor(public injector: Injector, public monthsService: EmployeeHistoryMonthsService) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();

    const component = this.control?.value;
    if (component) {
      const { attrs } = component;

      if (attrs?.years) {
        this.monthsService.years = attrs?.years;
        this.monthsService.isNonStop = attrs?.nonStop;

        this.monthsService.initSettings().then(() => {
          this.maxMonth = this.monthsService.maxDate;
          this.minMonth = this.monthsService.minDateFrom;

          this.cdr.markForCheck();
        });
      } else {
        this.control.valueChanges
          .pipe(startWith(this.control.value as ComponentDto), takeUntil(this.ngUnsubscribe$))
          .subscribe((value) => {
            const minDate = value.attrs?.minDate;
            const maxDate = value.attrs?.maxDate;

            if (minDate) {
              this.minMonth = MonthYear.fromDate(
                DatesHelperService.relativeOrFixedToFixed(minDate),
              );
            } else {
              this.minMonth = undefined;
            }
            if (maxDate) {
              this.maxMonth = MonthYear.fromDate(
                DatesHelperService.relativeOrFixedToFixed(maxDate),
              );
            } else {
              this.maxMonth = undefined;
            }

            this.cdr.markForCheck();
          });
      }
    }
  }
}
