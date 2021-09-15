import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  ActionType,
  ComponentAttrsDto,
  ComponentFieldDto,
  ComponentValidationDto,
  CustomValidationDto,
} from '@epgu/epgu-constructor-types';
import { UnsubscribeService, SessionStorageService } from '@epgu/epgu-constructor-ui-kit';
import {
  ConfirmUserData,
  ConfirmUserDataError,
} from '../../confirm-personal-user-data-screen.types';
import { AbstractConfirmPersonalUserDataDirective } from '../abstract-confirm-personal-user-data.directive';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-data',
  templateUrl: './confirm-personal-user-data.component.html',
  styleUrls: ['./confirm-personal-user-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ConfirmPersonalUserDataComponent
  extends AbstractConfirmPersonalUserDataDirective<ConfirmUserData>
  implements OnInit {
  actionType = ActionType;
  errors: ConfirmUserDataError[] = [];
  private readonly sessionStorageService: SessionStorageService = new SessionStorageService();

  ngOnInit(): void {
    super.ngOnInit();

    this.sessionStorageService.setRaw(
      'childId',
      this.screenService.cycledApplicantAnswerContext?.cycledApplicantAnswerItem?.id || '',
    );

    const customValidation: CustomValidationDto = this.screenService.getStore().display
      ?.components[0]?.attrs?.customValidation;
    if (customValidation) {
      const value: { [key: string]: unknown } =
        JSON.parse(this.screenService.getStore().display?.components[0]?.value) || {};
      const fields: ComponentFieldDto[] = this.screenService.getStore().display?.components[0]
        ?.attrs?.fields;
      customValidation.fields?.forEach((currentFieldName: string) => {
        const currentField: ComponentFieldDto = fields.find(
          (field: ComponentFieldDto) => field.fieldName === currentFieldName,
        );

        // eslint-disable-next-line
        const testFieldValue: string = value[customValidation.path][currentFieldName] as string;
        const currentFieldValidators: ComponentValidationDto[] = (currentField.attrs as ComponentAttrsDto)
          ?.validation;
        currentFieldValidators?.forEach((currentValidator: ComponentValidationDto) => {
          if (!RegExp(currentValidator.value).test(testFieldValue)) {
            this.errors.push({
              type: 'error',
              title: 'Ошибка',
              desc: currentValidator.errorMsg,
            } as ConfirmUserDataError);
          }
        });
      });
    }
  }
}
