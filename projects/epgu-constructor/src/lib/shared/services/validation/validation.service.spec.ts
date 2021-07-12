import { TestBed } from '@angular/core/testing';
import { FormArray, FormControl } from '@angular/forms';
import {
  CustomComponent,
  CustomScreenComponentTypes,
} from '../../../component/custom-screen/components-list.types';
import { ComponentsListToolsService } from '../../../component/custom-screen/services/components-list-tools/components-list-tools.service';
import { ValidationService } from './validation.service';
import { DateRangeService } from '../date-range/date-range.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { ConfigService, DatesToolsService, LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { DateRestrictionsService } from '../date-restrictions/date-restrictions.service';

describe('ValidationService', () => {
  let service: ValidationService;
  let dateInputComponent = ({
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

  let mockComponent: CustomComponent = {
    id: 'rf1',
    type: CustomScreenComponentTypes.StringInput,
    label: 'Прежняя фамилия',
    attrs: {
      dictionaryType: '',
      ref: [],
      labelAttr: '',
      fields: [],
      validation: [
        {
          type: 'RegExp',
          value: '^.{0,10}$',
          ref: '',
          dataType: '',
          condition: '',
          errorMsg: 'Поле может содержать не более 10 символов',
          updateOn: 'change',
        },
        {
          type: 'RegExp',
          value: '^[-а-яА-ЯЁё0-9 .,/]+$',
          ref: '',
          dataType: '',
          condition: '',
          errorMsg:
            'Поле может содержать только русские буквы, дефис, пробел, точку, а также цифры',
          updateOn: 'change',
        },
        {
          type: 'RegExp',
          value: '^.{9}$',
          ref: '',
          dataType: '',
          condition: '',
          errorMsg: 'Поле должно содержать 9 символов',
          updateOn: 'blur',
        },
        {
          type: 'RegExp',
          value: '.*[0-9]+.*',
          ref: '',
          dataType: '',
          condition: '',
          errorMsg: 'Поле должно содержать хотя бы одну цифру',
          updateOn: 'blur',
        },
      ],
    },
    value: '',
    required: true,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ValidationService,
        ComponentsListToolsService,
        DateRangeService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        DatesToolsService,
        DateRestrictionsService,
        ConfigService,
        LoggerService,
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ValidationService);
  });

  describe('customValidator', () => {
    it('should return proper error for control value exeeding max length', () => {
      const customValidator = service.customValidator(mockComponent);
      const control = new FormControl('input');
      control.setValue('123456789аб');
      expect(customValidator(control)).toEqual({
        msg: 'Поле может содержать не более 10 символов',
        textFromJson: true,
      });
    });

    it('should return proper error for control value containing wrong symbols', () => {
      const customValidator = service.customValidator(mockComponent);
      const control = new FormControl('input');
      control.setValue('123афы№%$');
      expect(customValidator(control)).toEqual({
        msg: 'Поле может содержать только русские буквы, дефис, пробел, точку, а также цифры',
        textFromJson: true,
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
      expect(customValidator(control)).toEqual({ msg: '', textFromJson: false });
      control.markAsTouched();
      expect(customValidator(control)).toEqual({
        msg: 'Обязательно для заполнения',
        textFromJson: false,
      });
    });
  });

  describe('customValidator', () => {
    it('should return proper error for control value with not enought length', (done) => {
      const customAsyncValidator = service.customAsyncValidator(mockComponent, 'blur');
      const control = new FormControl('input');
      control.setValue('12345678фи');
      customAsyncValidator(control).subscribe((obj) => {
        expect(obj).toEqual({ msg: 'Поле должно содержать 9 символов', textFromJson: true });
        done();
      });
    });

    it('should return proper error for control value without any digits', (done) => {
      const customAsyncValidator = service.customAsyncValidator(mockComponent, 'blur');
      const control = new FormControl('input');
      control.setValue('фыждлоекa');
      customAsyncValidator(control).subscribe((obj) => {
        expect(obj).toEqual({
          msg: 'Поле должно содержать хотя бы одну цифру',
          textFromJson: true,
        });
        done();
      });
    });

    it('should return proper error for control empty value', (done) => {
      const customAsyncValidator = service.customAsyncValidator(mockComponent, 'blur');
      const control = new FormControl('input');
      control.setValue('');
      control.markAsTouched();
      customAsyncValidator(control).subscribe((obj) => {
        expect(obj).toEqual({ msg: 'Обязательно для заполнения', textFromJson: false });
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
    ];
    const control = new FormControl('input');
    control.setValue('12');

    it('for customValidator', () => {
      components.forEach((component) => {
        const customValidator = service.customValidator(component as any);
        expect(customValidator(control)).toEqual({ msg: 'ошибка', textFromJson: true });
      });
    });

    it('for customAsyncValidator', (done) => {
      control.markAsTouched();
      components.forEach((component) => {
        component.attrs.validation[0]['updateOn'] = 'blur';
        const customAsyncValidator = service.customAsyncValidator(component as any, 'blur');
        customAsyncValidator(control).subscribe((obj) => {
          expect(obj).toEqual({ msg: 'ошибка', textFromJson: true });
          done();
        });
      });
    });
  });

  it('should show server validation errors for DateInput', () => {
    const date = new Date('2021-02-20T00:00:00.000+06:00');
    const dateToolsService = TestBed.inject(DatesToolsService);
    const validationBackendError = service.validationBackendError(
      'Значение не прошло валидацию minDate',
      dateInputComponent,
    );
    const control = new FormControl('input');
    dateInputComponent.value = dateToolsService.format(date);
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

    it('should return true', () => {
      service.form = new FormArray([
        new FormControl({ id: 'bik_dict', value: null }),
        new FormControl({ id: 'bik', value: '004525988' }),
        new FormControl({ id: 'corr', value: '03100643000000017300' })
      ]);
      const isValid = service.checkRS('40102810545370000003', { bik_dict: 'bik_dict', bik: 'bik', corr: 'corr' });
      expect(isValid).toBeTruthy();
    });

    it('should return false', () => {
      service.form = new FormArray([new FormControl({ id: 'bik', value: '049205603' })]);
      const isValid = service.checkRS('40817810362001249935', { bik: 'bik' });
      expect(isValid).toBeFalsy();
    });
  });

  describe('checkCardNumber()', () => {
    const checkNumber = (number: any) => service.checkCardNumber(number);

    it('should return true', () => {
      expect(checkNumber('5469 3800 2401 6155')).toBeTruthy();
      expect(checkNumber('5469380024016155')).toBeTruthy();
      expect(checkNumber('5469-3800-2401-6155')).toBeTruthy();

      expect(checkNumber('5213 2439 2469 4266')).toBeTruthy();
      expect(checkNumber('5213 & 2439 ololo2469 ololo4266')).toBeTruthy();
      expect(checkNumber('5213 2439 2469 4464')).toBeTruthy();
      expect(checkNumber('2200 3307 9345 4721 809')).toBeTruthy();
      expect(checkNumber('2200 3307 1335 4721 6')).toBeTruthy();
    });

    it('should return false', () => {
      expect(checkNumber('5439 3800 2401 6155')).toBeFalsy();
      expect(checkNumber('5469 3800 2401')).toBeTruthy();
    });
  });
});
