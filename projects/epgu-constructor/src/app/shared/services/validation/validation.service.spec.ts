import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import {
  CustomComponent,
  CustomScreenComponentTypes,
} from '../../components/components-list/components-list.types';
// eslint-disable-next-line max-len
import { ComponentsListToolsService } from '../components-list-tools/components-list-tools.service';
import { ValidationService } from './validation.service';
import { DateRangeService } from '../date-range/date-range.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ValidationService,
        ComponentsListToolsService,
        DateRangeService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        DatesToolsService,
      ],
    });
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
