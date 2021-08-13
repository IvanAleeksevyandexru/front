import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { isEmpty as _isEmpty } from 'lodash';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import {
  ConfirmUserDataError,
  ConfirmUserDataErrorType,
} from '../confirm-personal-user-data-screen/confirm-personal-user-data-screen.types';
import { INN_ERROR, InnState, PersonalUserInnWithErrors } from './person-user-inn.types';

@Component({
  selector: 'epgu-constructor-person-user-inn',
  templateUrl: './person-user-inn.component.html',
  styleUrls: ['./person-user-inn.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonUserInnComponent implements OnInit {
  InnState = InnState;

  data$ = this.screenService.component$.pipe(
    map<PersonalUserInnWithErrors, PersonalUserInnWithErrors>((data) => ({
      ...data,
      value: data.value,
      errors: data?.errors || [],
    })),
  );
  errors: ConfirmUserDataError[] = [];
  currentInnState = InnState.valid;

  private innRegExp = /^\d{12}$/;

  constructor(
    public currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      if (_isEmpty(data.value)) {
        this.currentInnState = InnState.empty;
        this.errors.push(INN_ERROR.EMPTY);
      } else if (!this.innRegExp.test(data.value)) {
        this.currentInnState = InnState.invalid;
        this.errors.push(INN_ERROR.INVALID);
      }

      this.updateValue(data.value, data.errors);
      this.changeDetectionRef.markForCheck();
    });
  }

  updateValue(value: string, errors: ConfirmUserDataError[]): void {
    if (value) {
      this.currentAnswersService.state = value;
    }
    const hasBackendErrors = errors.some((error) => error?.type === ConfirmUserDataErrorType.error);
    const hasFrontendErrors = !_isEmpty(this.errors);
    this.currentAnswersService.isValid = !hasBackendErrors && !hasFrontendErrors;
  }
}
