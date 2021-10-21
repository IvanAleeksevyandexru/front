import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { BrokenDateFixStrategy, ValidationShowOn } from '@epgu/ui/models/common-enums';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { DateRangeAttrs } from '../../../../shared/services/date-range/date-range.models';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import DateInputModelAttrs from './DateInputModelAttrs';

@Component({
  selector: 'epgu-constructor-date-input',
  templateUrl: './date-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class DateInputComponent extends AbstractComponentListItemComponent<DateInputModelAttrs> {
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  minDateDefault = '-120y';
  maxDateDefault = '+50y';
  clearable = true;
  align = 'left';
  strategy = BrokenDateFixStrategy.NONE;

  constructor(public injector: Injector, private dateRangeService: DateRangeService) {
    super(injector);
  }

  clearDate(id: string, attrs: DateRangeAttrs): void {
    this.dateRangeService.clearDate(id, attrs);
  }
}
