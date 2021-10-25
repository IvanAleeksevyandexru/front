import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { ConstructorCheckboxComponent } from '@epgu/epgu-constructor-ui-kit';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { ErrorTemplate } from '../../../../typings';

@Component({
  selector: 'epgu-constructor-time-slot-checkbox-error',
  templateUrl: './time-slot-checkbox-error.component.html',
  styleUrls: ['./time-slot-checkbox-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotCheckboxErrorComponent {
  @ViewChild('checkboxComponent') checkboxComponent: ConstructorCheckboxComponent;
  @Input() error: ErrorTemplate;
  checkbox = new FormControl();

  isLoading$: Observable<boolean> = this.screenService.isLoading$;

  constructor(private screenService: ScreenService) {}
}
