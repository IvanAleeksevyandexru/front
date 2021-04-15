import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { isEmpty as _isEmpty } from 'lodash';
import { ConfigService } from '../../../../core/services/config/config.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase } from '../../../../screen/screen.types';
import { DTOActionAction } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
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
  data$: Observable<PersonalUserPhoneEmailWithErrors> = this.screenService.component$.pipe(
    map((data) => this.prepareDataWithErrors(data)),
  );
  isPhoneScreenType: boolean;
  isEditContactAction: boolean;

  constructor(
    public currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
    public config: ConfigService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      this.isEditContactAction = this.getIsEditContactAction();
      this.isPhoneScreenType = this.getIsPhoneScreenType();
      this.updateValue(data.value);

      setTimeout(() => {
        this.changeDetectionRef.markForCheck();
      });
    });
  }

  updateValue(value: string): void {
    this.currentAnswersService.state = this.getPersonalTypeValue(value);
    const errors = this.getErrors();
    const hasErrors = errors.some((error) => error?.type === ConfirmUserDataErrorType.error);
    this.currentAnswersService.isValid = !_isEmpty(value) && !hasErrors;
  }

  private getIsEditContactAction(): boolean {
    const isEditPhone = [DTOActionAction.editPhoneNumber, DTOActionAction.editLegalPhone].includes(
      this.screenService.action?.action,
    );
    const isEditEmail = [DTOActionAction.editEmail, DTOActionAction.editLegalEmail].includes(
      this.screenService.action?.action,
    );
    return isEditPhone || isEditEmail;
  }

  private getIsPhoneScreenType(): boolean {
    return [
      UniqueScreenComponentTypes.confirmUserCorpPhone,
      UniqueScreenComponentTypes.confirmPersonalUserPhone,
      UniqueScreenComponentTypes.confirmLegalPhone,
    ].includes(this.screenService.component?.type as UniqueScreenComponentTypes);
  }

  private getPersonalTypeValue(value): string {
    return this.getIsPhoneScreenType() ? value : { email: value };
  }

  private getErrors(): ConfirmUserDataError[] {
    const { value } = this.screenService.component;
    return !this.getIsPhoneScreenType() ? JSON.parse(value)?.errors || [] : [];
  }

  private prepareDataWithErrors(data: ComponentBase): PersonalUserPhoneEmailWithErrors {
    const { value } = data;
    return {
      ...data,
      value: !this.getIsPhoneScreenType() ? JSON.parse(value).email : value,
      errors: this.getErrors(),
    };
  }
}
