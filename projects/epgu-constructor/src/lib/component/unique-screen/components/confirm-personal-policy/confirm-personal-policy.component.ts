import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { UnsubscribeService, ConfigService } from '@epgu/epgu-constructor-ui-kit';

import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { PersonalPolicyWithErrors } from './confirm-personal-policy.types';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-policy',
  templateUrl: './confirm-personal-policy.component.html',
  styleUrls: ['./confirm-personal-policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmPersonalPolicyComponent implements OnInit {
  data$ = this.screenService.component$.pipe(
    map<PersonalPolicyWithErrors, PersonalPolicyWithErrors>((data) => ({
      ...data,
      value: data.value,
      errors: data?.errors || [],
    })),
  );
  isPhoneScreenType: boolean;
  series: string;
  number: string;

  constructor(
    public currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
    public config: ConfigService,
    private ngUnsubscribe$: UnsubscribeService,
    private jsonHelperService: JsonHelperService,
  ) {}

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      if (data.value) {
        this.currentAnswersService.state = data.value;
        const value = this.jsonHelperService.tryToParse(data.value) as {
          series: string;
          number: string;
        };
        this.series = value.series;
        this.number = value.number;
      }
    });
  }
}
