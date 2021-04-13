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
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

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
      });
    });

    it('should return proper error for control value containing wrong symbols', () => {
      const customValidator = service.customValidator(mockComponent);
      const control = new FormControl('input');
      control.setValue('123афы№%$');
      expect(customValidator(control)).toEqual({
        msg: 'Поле может содержать только русские буквы, дефис, пробел, точку, а также цифры',
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
      expect(customValidator(control)).toEqual({ msg: '' });
      control.markAsTouched();
      expect(customValidator(control)).toEqual({ msg: 'Обязательно для заполнения' });
    });
  });

  describe('customValidator', () => {
    it('should return proper error for control value with not enought length', (done) => {
      const customAsyncValidator = service.customAsyncValidator(mockComponent, 'blur');
      const control = new FormControl('input');
      control.setValue('12345678фи');
      customAsyncValidator(control).subscribe((obj) => {
        expect(obj).toEqual({ msg: 'Поле должно содержать 9 символов' });
        done();
      });
    });

    it('should return proper error for control value without any digits', (done) => {
      const customAsyncValidator = service.customAsyncValidator(mockComponent, 'blur');
      const control = new FormControl('input');
      control.setValue('фыждлоекa');
      customAsyncValidator(control).subscribe((obj) => {
        expect(obj).toEqual({ msg: 'Поле должно содержать хотя бы одну цифру' });
        done();
      });
    });

    it('should return proper error for control empty value', (done) => {
      const customAsyncValidator = service.customAsyncValidator(mockComponent, 'blur');
      const control = new FormControl('input');
      control.setValue('');
      control.markAsTouched();
      customAsyncValidator(control).subscribe((obj) => {
        expect(obj).toEqual({ msg: 'Обязательно для заполнения' });
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
    ];
    const control = new FormControl('input');
    control.setValue('12');

    it('for customValidator', () => {
      components.forEach((component) => {
        const customValidator = service.customValidator(component as any);
        expect(customValidator(control)).toEqual({ msg: 'ошибка' });
      });
    });

    it('for customAsyncValidator', (done) => {
      control.markAsTouched();
      components.forEach((component) => {
        component.attrs.validation[0]['updateOn'] = 'blur';
        const customAsyncValidator = service.customAsyncValidator(component as any, 'blur');
        customAsyncValidator(control).subscribe((obj) => {
          expect(obj).toEqual({ msg: 'ошибка' });
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
    it('should be return true', () => {
      service.form = new FormArray([new FormControl({ id: 'bik', value: '044030827' })]);
      const isValid = service.checkRS('40702810900000002851', { bik: 'bik' });
      expect(isValid).toBeTruthy();
    });

    it('should be return false', () => {
      service.form = new FormArray([new FormControl({ id: 'bik', value: '049205603' })]);
      const isValid = service.checkRS('40817810362001249935', { bik: 'bik' });
      expect(isValid).toBeFalsy();
    });
  });
});
