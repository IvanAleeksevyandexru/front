import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { BrokenDateFixStrategy, ValidationShowOn } from 'epgu-lib';
import { DateRangeService } from '../../../../services/date-range/date-range.service';
import { DateRangeAttrs } from '../../../../services/date-range/date-range.models';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';

@Component({
  selector: 'epgu-constructor-date-input',
  templateUrl: './date-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class DateInputComponent extends AbstractComponentListItemComponent {
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  minDateDefault = '-120y';
  maxDateDefault = '+50y';
  clearable = true;
  align = 'left';
  strategy = BrokenDateFixStrategy;

  constructor(public injector: Injector, private dateRangeService: DateRangeService) {
    super(injector);
  }

  clearDate(id: string, attrs: DateRangeAttrs): void {
    this.dateRangeService.clearDate(id, attrs);
  }
}
