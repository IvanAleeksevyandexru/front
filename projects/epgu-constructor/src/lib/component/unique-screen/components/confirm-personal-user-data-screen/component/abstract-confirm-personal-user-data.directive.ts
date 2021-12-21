import { ChangeDetectorRef, Directive, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent, ConfigService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ComponentBase } from '../../../../../screen/screen.types';
import { ScreenService } from '../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import {
  ConfirmUserDataError,
  ConfirmUserDataErrorType,
} from '../confirm-personal-user-data-screen.types';
import {
  ComponentAttrsDto,
  ComponentFieldDto,
  ComponentValidationDto,
  CustomValidationDto,
} from '@epgu/epgu-constructor-types';

@Directive()
export abstract class AbstractConfirmPersonalUserDataDirective<T extends ComponentBase>
  extends BaseComponent
  implements OnInit {
  data$: Observable<T> = this.screenService.component$ as Observable<T>;

  errors: ConfirmUserDataError[] = [];

  constructor(
    public config: ConfigService,
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      this.updateValue(data.value);
      this.changeDetectionRef.markForCheck();
    });

    this.processCustomValidation();
  }

  protected processCustomValidation(): void {
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

  private updateValue(value: string): void {
    if (value) {
      this.currentAnswersService.state = value;
      const { errors = [] } = JSON.parse(value);
      const hasErrors = errors.some((error) => error?.type === ConfirmUserDataErrorType.error);
      this.currentAnswersService.isValid = !hasErrors;
    }
  }
}
