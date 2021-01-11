import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { EventBusService } from '../../../../../form-player/services/event-bus/event-bus.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ComponentBase } from '../../../../../screen/screen.types';
import { PassportFormFields } from '../../../../../shared/components/add-passport/passport.interface';

@Component({
  selector: 'epgu-constructor-add-passport-container',
  templateUrl: './add-passport-component-container.component.html',
  styleUrls: ['./add-passport-component-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPassportContainerComponent implements OnInit {
  data$: Observable<ComponentBase> = this.screenService.component$;

  constructor(
    private currentAnswersService: CurrentAnswersService,
    private screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.eventBusService
      .on('passportValueChangedEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: PassportFormFields) => {
        this.onPassportDataChange(payload);
        this.cdr.markForCheck();
      });
  }

  onPassportDataChange(data: PassportFormFields): void {
    this.currentAnswersService.state = data;
  }
}
