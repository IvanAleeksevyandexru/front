import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { isEmpty as _isEmpty } from 'lodash';
import { ConfigService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import {
  ConfirmUserDataError,
  ConfirmUserDataErrorType,
} from '../confirm-personal-user-data-screen/confirm-personal-user-data-screen.types';
import { INN_ERROR, INN_WARN, InnState, PersonalUserInnWithErrors } from './person-user-inn.types';

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
      skipValidation: data?.skipValidation,
    })),
  );
  errors: ConfirmUserDataError[] = [];
  currentInnState = InnState.valid;
  warnings: ConfirmUserDataError[] = [];

  private innRegExp = /^([0-9][1-9]|[1-9][0-9])[0-9]{10}$/;

  constructor(
    public currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
    public config: ConfigService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      if (!data.required && data?.skipValidation) {
        this.skipValidation();
      } else {
        if (_isEmpty(data.value)) {
          this.currentInnState = InnState.empty;
          this.errors.push(INN_ERROR.EMPTY);
        } else if (!this.innRegExp.test(data.value)) {
          this.currentInnState = InnState.invalid;
          this.errors.push(INN_ERROR.INVALID);
        }

        this.updateValue(data.value, data.errors);
        this.changeDetectionRef.markForCheck();
      }
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

  skipValidation(): void {
    this.currentInnState = InnState.empty;
    this.warnings.push(INN_WARN.EMPTY_WARN);
    this.currentAnswersService.isValid = true;
    this.changeDetectionRef.markForCheck();
  }
}
