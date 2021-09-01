import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { isEmpty as _isEmpty } from 'lodash';
import { UnsubscribeService, ConfigService } from '@epgu/epgu-constructor-ui-kit';

import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase } from '../../../../screen/screen.types';
import { UniqueScreenComponentTypes } from '../../unique-screen-components.types';
import {
  ConfirmUserDataError,
  ConfirmUserDataErrorType,
} from '../confirm-personal-user-data-screen/confirm-personal-user-data-screen.types';

type PersonalUserPhoneEmailWithErrors = ComponentBase & {
  errors: ConfirmUserDataError[];
};

@Component({
  selector: 'epgu-constructor-confirm-personal-user-phone-email',
  templateUrl: './confirm-personal-user-phone-email.component.html',
  styleUrls: ['./confirm-personal-user-phone-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmPersonalUserPhoneEmailComponent implements OnInit {
  data$ = this.screenService.component$.pipe(
    map<PersonalUserPhoneEmailWithErrors, PersonalUserPhoneEmailWithErrors>((data) => ({
      ...data,
      value: data.value,
      errors: data?.errors || [],
    })),
  );
  isPhoneScreenType: boolean;

  constructor(
    public currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
    public config: ConfigService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      this.isPhoneScreenType = this.getIsPhoneScreenType();
      this.updateValue(data.value, data.errors);

      setTimeout(() => {
        this.changeDetectionRef.markForCheck();
      });
    });
  }

  updateValue(value: string, errors: ConfirmUserDataError[]): void {
    if (value) {
      this.currentAnswersService.state = value;
    }
    const hasErrors = errors.some((error) => error?.type === ConfirmUserDataErrorType.error);
    this.currentAnswersService.isValid = !_isEmpty(value) && !hasErrors;
  }

  private getIsPhoneScreenType(): boolean {
    return [
      UniqueScreenComponentTypes.confirmUserCorpPhone,
      UniqueScreenComponentTypes.confirmPersonalUserPhone,
      UniqueScreenComponentTypes.confirmLegalPhone,
    ].includes(this.screenService.component?.type as UniqueScreenComponentTypes);
  }
}
