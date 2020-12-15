import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { CustomComponent, CustomScreenComponentTypes } from '../../components-list.types';
import { ComponentListToolsService } from '../component-list-tools/component-list-tools.service';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;
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
    required: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationService, ComponentListToolsService],
    });
    service = TestBed.inject(ValidationService);
  });

  describe('customValidator', () => {
    it('should return proper error for control value exeeding max length', () => {
      const customValidator = service.customValidator(mockComponent);
      const control = new FormControl('input');
      control.setValue('123456789аб');
      expect(customValidator(control)).toEqual({ msg: 'Поле может содержать не более 10 символов' });
    });

    it('should return proper error for control value containing wrong symbols', () => {
      const customValidator = service.customValidator(mockComponent);
      const control = new FormControl('input');
      control.setValue('123афы№%$');
      expect(customValidator(control)).toEqual({ msg: 'Поле может содержать только русские буквы, дефис, пробел, точку, а также цифры' });
    });

    it('should return proper error for required control value', () => {
      const customValidator = service.customValidator(mockComponent);
      const control = new FormControl('input');
      control.setValue('');
      control.markAsTouched();
      expect(customValidator(control)).toEqual({ msg: 'Обязательно для заполнения' });
    });
  });

  describe('customValidator', () => {
    it('should return proper error for control value with not enought length', (done) => {
      const customAsyncValidator = service.customAsyncValidator(mockComponent, 'blur');
      const control = new FormControl('input');
      control.setValue('12345678фи');
      customAsyncValidator(control).subscribe(obj => {
        expect(obj).toEqual({ msg: 'Поле должно содержать 9 символов' });
        done();
      });
    });

    it('should return proper error for control value without any digits', (done) => {
      const customAsyncValidator = service.customAsyncValidator(mockComponent, 'blur');
      const control = new FormControl('input');
      control.setValue('фыждлоекa');
      customAsyncValidator(control).subscribe(obj => {
        expect(obj).toEqual({ msg: 'Поле должно содержать хотя бы одну цифру' });
        done();
      });
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
