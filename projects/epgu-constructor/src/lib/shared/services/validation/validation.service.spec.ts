import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import {
  ConfigService,
  DatesToolsService,
  HealthService,
  HealthServiceStub,
  JsonHelperService,
  JsonHelperServiceStub,
  LoggerService,
} from '@epgu/epgu-constructor-ui-kit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockProvider } from 'ng-mocks';
import {
  CustomComponent,
  CustomScreenComponentTypes,
  UpdateOn,
} from '../../../component/custom-screen/components-list.types';
import { ComponentsListToolsService } from '../../../component/custom-screen/services/components-list-tools/components-list-tools.service';
import { ValidationService } from './validation.service';
import { DateRangeService } from '../date-range/date-range.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { DateRestrictionsService } from '../date-restrictions/date-restrictions.service';
import { DateRefService } from '../../../core/services/date-ref/date-ref.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';
import { DictionaryToolsServiceStub } from '../dictionary/dictionary-tools.service.stub';
import { HelperService } from '@epgu/ui/services/helper';
import createModel from '../../../component/custom-screen/component-list-resolver/ModelFactory';
import { ComponentDto } from '@epgu/epgu-constructor-types';

describe('ValidationService', () => {
  let service: ValidationService;
  let restrictionService: DateRestrictionsService;
  const dateInputComponent = ({
    id: 'pd8',
    type: CustomScreenComponentTypes.DateInput,
    label: 'по',
    attrs: {
      grid: 'grid-col-6 grid-col-12-sm',
      brokenDateFixStrategy: 'restore',
      accuracy: 'day',
      minDate: 'today',
      validation: [
        {
          type: 'RegExp',
          value: '.*',
          ref: '',
          condition: '',
          errorMsg: 'Поле должно быть заполнено',
        },
        {
          type: 'minDate',
          ref: '',
          value: '',
          condition: '',
          add: { day: 1 },
          errorMsg: 'Дата начала периода не может быть позже даты окончания периода регистрации',
        },
      ],
      refs: {},
    },
    linkedValues: [],
    arguments: {},
    value: '2021-02-20T00:00:00.000+06:00',
    required: true,
    valueFromCache: true,
    presetValue: '',
  } as unknown) as CustomComponent;

  const mockComponent: CustomComponent = {
    id: 'rf1',
    type: CustomScreenComponentTypes.StringInput,
    label: 'Прежняя фамилия',
    attrs: {
      dictionaryType: '',
      ref: [],
      fields: [],
      validation: [
        {
          type: 'RegExp',
          value: '^.{0,10}$',
          ref: '',
          dataType: '',
          condition: '',
          errorMsg: 'Поле может содержать не более 10 символов',
          updateOn: UpdateOn.ON_CHANGE,
        },
        {
          type: 'RegExp',
          value: '^[-а-яА-ЯЁё0-9 .,/]+$',
          ref: '',
          dataType: '',
          condition: '',
          errorMsg:
            'Поле может содержать только русские буквы, дефис, пробел, точку, а также цифры',
          updateOn: UpdateOn.ON_CHANGE,
        },
        {
          type: 'RegExp',
          value: '^.{9}$',
          ref: '',
          dataType: '',
          condition: '',
          errorMsg: 'Поле должно содержать 9 символов',
          updateOn: UpdateOn.ON_BLUR,
        },
        {
          type: 'RegExp',
          value: '.*[0-9]+.*',
          ref: '',
          dataType: '',
          condition: '',
          errorMsg: 'Поле должно содержать хотя бы одну цифру',
          updateOn: UpdateOn.ON_BLUR,
        },
      ],
    },
    value: '',
    required: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ValidationService,
        ComponentsListToolsService,
        DateRangeService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: HealthService, useClass: HealthServiceStub },
        CurrentAnswersService,
        DatesToolsService,
        DateRestrictionsService,
        MockProvider(DateRefService),
        MockProvider(HelperService),
        ConfigService,
        LoggerService,
        { provide: DictionaryToolsService, useClass: DictionaryToolsServiceStub },
        { provide: JsonHelperService, useClass: JsonHelperServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ValidationService);
    restrictionService = TestBed.inject(DateRestrictionsService);
  });

  describe('customValidator', () => {
    it('should return proper error for control value exeeding max length', () => {
      const customValidator = service.customValidator(mockComponent);
      const control = new FormControl('input');
      control.setValue('123456789аб');
      expect(customValidator(control)).toEqual({
        msg: 'Поле может содержать не более 10 символов',
        textFromJson: true,
        updateOn: UpdateOn.ON_CHANGE,
      });
    });

    it('should return proper error for control value containing wrong symbols', () => {
      const customValidator = service.customValidator(mockComponent);
      const control = new FormControl('input');
      control.setValue('123афы№%$');
      expect(customValidator(control)).toEqual({
        msg: 'Поле может содержать только русские буквы, дефис, пробел, точку, а также цифры',
        textFromJson: true,
        updateOn: UpdateOn.ON_CHANGE,
      });
    });

    it('should break validation if LabelSection', () => {
      const labelCmp = { ...mockComponent, type: CustomScreenComponentTypes.LabelSection };
      const customValidator = service.customValidator(labelCmp);
      const control = new FormControl(null);
      expect(customValidator(control)).toEqual(null);
    });

    it('should return required error if empty value', () => {
      const customValidator = service.customValidator(mockComponent);
      const control = new FormControl(null);
      expect(customValidator(control)).toEqual({
        msg: '',
        updateOn: UpdateOn.ON_CHANGE,
      });
      control.markAsTouched();
      expect(customValidator(control)).toEqual({
        msg: 'Обязательно для заполнения',
        updateOn: UpdateOn.ON_CHANGE,
      });
    });
  });

  describe('customAsyncValidator', () => {
    it('should return proper error for control value with not enought length', (done) => {
      const customAsyncValidator = service.customAsyncValidator(mockComponent, UpdateOn.ON_BLUR);
      const control = new FormControl('input');
      control.setValue('12345678фи');
      // @ts-ignore
      customAsyncValidator(control).subscribe((obj) => {
        expect(obj).toEqual({
          msg: 'Поле должно содержать 9 символов',
          textFromJson: true,
          updateOn: UpdateOn.ON_BLUR,
        });
        done();
      });
    });

    it('should return proper error for control value without any digits', (done) => {
      const customAsyncValidator = service.customAsyncValidator(mockComponent, UpdateOn.ON_BLUR);
      const control = new FormControl('input');
      control.setValue('фыждлоекa');
      // @ts-ignore
      customAsyncValidator(control).subscribe((obj) => {
        expect(obj).toEqual({
          msg: 'Поле должно содержать хотя бы одну цифру',
          textFromJson: true,
          updateOn: UpdateOn.ON_BLUR,
        });
        done();
      });
    });

    it('should return proper error for control empty value', (done) => {
      const customAsyncValidator = service.customAsyncValidator(mockComponent, UpdateOn.ON_BLUR);
      const control = new FormControl('input');
      control.setValue('');
      control.markAsTouched();
      // @ts-ignore
      customAsyncValidator(control).subscribe((obj) => {
        expect(obj).toEqual({
          msg: 'Обязательно для заполнения',
          updateOn: UpdateOn.ON_BLUR,
        });
        done();
      });
    });
  });

  describe('should return customMessage if validation-fn', () => {
    const attrs = { validation: [{ type: 'validation-fn', errorMsg: 'ошибка' }] };
    const components = [
      { type: CustomScreenComponentTypes.OgrnInput, attrs },
      { type: CustomScreenComponentTypes.OgrnipInput, attrs },
      { type: CustomScreenComponentTypes.SnilsInput, attrs },
      { type: CustomScreenComponentTypes.PersonInnInput, attrs },
      { type: CustomScreenComponentTypes.LegalInnInput, attrs },
      { type: CustomScreenComponentTypes.CardNumberInput, attrs },
    ].map((component) => createModel(component as ComponentDto));
    const control = new FormControl('input');
    control.setValue('12');

    it('for customValidator', () => {
      components.forEach((component) => {
        const customValidator = service.customValidator(component as any);
        expect(customValidator(control)).toEqual({
          msg: 'ошибка',
          textFromJson: true,
          updateOn: UpdateOn.ON_CHANGE,
        });
      });
    });

    it('for customAsyncValidator', (done) => {
      control.markAsTouched();
      components.forEach((component) => {
        component.attrs.validation[0]['updateOn'] = UpdateOn.ON_BLUR;
        const customAsyncValidator = service.customAsyncValidator(
          component as any,
          UpdateOn.ON_BLUR,
        );
        // @ts-ignore
        customAsyncValidator(control).subscribe((obj) => {
          expect(obj).toEqual({ msg: 'ошибка', textFromJson: true, updateOn: UpdateOn.ON_BLUR });
        });
      });
      done();
    });
  });

  it('should show server validation errors for DateInput', () => {
    const date = new Date('2021-02-20T00:00:00.000+06:00');
    const dateAsStr = (date as unknown) as string;
    const validationBackendError = service.validationBackendError(
      'Значение не прошло валидацию minDate',
      dateInputComponent,
    );
    const control = new FormControl('input');
    dateInputComponent.value = dateAsStr;
    control.setValue(date);
    expect(validationBackendError(control)).toEqual({
      serverError: 'Значение не прошло валидацию minDate',
    });
  });

  describe('checkRS', () => {
    it('should return true', () => {
      service.form = new FormArray([new FormControl({ id: 'bik', value: '044030827' })]);
      const isValid = service.checkRS('40702810900000002851', { bik: 'bik' });
      expect(isValid).toBeTruthy();
    });

    it('should return true when "rs" starts with "0"', () => {
      service.form = new FormArray([new FormControl({ id: 'bik', value: '044030827' })]);
      const isValid = service.checkRS('00702810900000002851', { bik: 'bik' });
      expect(isValid).toBeTruthy();
    });

    it('should return false', () => {
      service.form = new FormArray([new FormControl({ id: 'bik', value: '049205603' })]);
      const isValid = service.checkRS('40817810362001249935', { bik: 'bik' });
      expect(isValid).toBeFalsy();
    });
  });

  describe('dateValidator()', () => {
    const compoundComponent = {
      type: CustomScreenComponentTypes.CalendarInput,
      attrs: {
        components: [
          {
            id: 'first',
            type: CustomScreenComponentTypes.DateInput,
            attrs: {
              validation: [
                {
                  type: 'Date',
                  value: '',
                  ref: '',
                  condition: '<',
                  errorMsg: 'Я ошибка',
                  dataType: 'aa',
                },
              ],
            },
          },
        ],
      },
      id: 'test',
    };

    const plainComponent = {
      type: CustomScreenComponentTypes.DateInput,
      id: 'test',
      attrs: {
        validation: [
          {
            type: 'Date',
            value: '',
            ref: '',
            condition: '>',
            errorMsg: 'Я ошибка',
            dataType: 'aa',
          },
        ],
      },
    };

    const range = { min: new Date(2005, 5, 5), max: new Date(2010, 10, 10) };
    const controlCompound = {
      value: { first: new Date(2004, 4, 4) },
      markAllAsTouched() {
        return null;
      },
    };
    const controlPlain = {
      value: new Date(2006, 6, 6),
      markAsTouched() {
        return null;
      },
    };

    it('should return error if min date is greater than value', () => {
      jest.spyOn(restrictionService, 'getDateRangeFromStore').mockImplementation((...args) => {
        return range;
      });
      controlCompound.value.first = new Date(2004, 4, 4);
      const validator = service.dateValidator(compoundComponent);

      const result = validator(controlCompound as AbstractControl);

      expect(result.msg).toEqual('Я ошибка');
    });

    it('should return nothing if min date is lower than value', () => {
      jest.spyOn(restrictionService, 'getDateRangeFromStore').mockImplementation((...args) => {
        return range;
      });
      controlCompound.value.first = new Date(2006, 6, 6);
      const validator = service.dateValidator(compoundComponent);

      const result = validator(controlCompound as AbstractControl);

      expect(result).toBeUndefined();
    });

    it('should return nothing if min date is equal to value', () => {
      jest.spyOn(restrictionService, 'getDateRangeFromStore').mockImplementation((...args) => {
        return range;
      });
      controlCompound.value.first = new Date(2005, 5, 5);
      const validator = service.dateValidator(compoundComponent);

      const result = validator(controlCompound as AbstractControl);

      expect(result).toBeUndefined();
    });

    it('should return undefined if max date is lower than value', () => {
      jest.spyOn(restrictionService, 'getDateRangeFromStore').mockImplementation((...args) => {
        return range;
      });
      controlPlain.value = new Date(2006, 6, 6);
      const validator = service.dateValidator(plainComponent);

      const result = validator(controlPlain as AbstractControl);

      expect(result).toBeUndefined();
    });

    it('should return error if max date is greater than value', () => {
      jest.spyOn(restrictionService, 'getDateRangeFromStore').mockImplementation((...args) => {
        return range;
      });
      controlPlain.value = new Date(2011, 11, 11);
      const validator = service.dateValidator(plainComponent);

      const result = validator(controlPlain as AbstractControl);

      expect(result.msg).toEqual('Я ошибка');
    });
  });
});
