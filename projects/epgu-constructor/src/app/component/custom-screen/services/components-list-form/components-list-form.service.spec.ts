import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentsListFormService } from './components-list-form.service';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ComponentsListToolsService } from '../components-list-tools/components-list-tools.service';
import { AddressHelperService } from '../../../../shared/services/address-helper/address-helper.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from 'projects/epgu-constructor/src/app/shared/services/dictionary/dictionary-api.service.stub';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ComponentsListRelationsService } from '../components-list-relations/components-list-relations.service';
import { RefRelationService } from '../../../../shared/services/ref-relation/ref-relation.service';
import {
  CustomComponent,
  CustomComponentRefRelation,
  CustomListFormGroup,
  CustomScreenComponentTypes,
} from '../../components-list.types';
import { Observable } from 'rxjs';
import { Component, Input } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';

describe('ComponentsListFormService', () => {
  let service: ComponentsListFormService;
  let fixture: ComponentFixture<MockComponent>;
  let componentMockData: CustomComponent = {
    id: 'rf1',
    type: CustomScreenComponentTypes.StringInput,
    label: 'Прежняя фамилия',
    attrs: {
      dictionaryType: 'MARKI_TS',
      ref: [
        {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.displayOn,
        },
      ],
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
      updateOnValidation: 'blur',
    },
    value: 'value',
    required: true,
  };
  let component: MockComponent;
  let dictionaryToolsService: DictionaryToolsService;
  let addressHelperService: AddressHelperService;
  let componentsListToolsService: ComponentsListToolsService;

  @Component({
    template: `
      <div [formGroup]="form">
        <input formControlName="value" id="test" />
      </div>
    `,
  })
  class MockComponent {
    @Input() componentMockData: CustomComponent;
    form: FormGroup;
    constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
        value: new FormControl({ value: '' }),
      });
    }
  }

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        ComponentsListFormService,
        ValidationService,
        UnsubscribeService,
        ComponentsListToolsService,
        AddressHelperService,
        LoggerService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        DateRangeService,
        DatesToolsService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        DictionaryToolsService,
        ComponentsListRelationsService,
        HttpClient,
        HttpHandler,
        RefRelationService,
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ComponentsListFormService);
    dictionaryToolsService = TestBed.inject(DictionaryToolsService);
    addressHelperService = TestBed.inject(AddressHelperService);
    componentsListToolsService = TestBed.inject(ComponentsListToolsService);
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
    component.componentMockData = componentMockData;
    fixture.detectChanges();
  });

  describe('create()', () => {
    it('should call watchFormArray$() and emitChanges()', () => {
      const watchFormArraySpy = jest.spyOn(service, 'watchFormArray$');
      const emitChangesSpy = jest.spyOn(service, 'emitChanges');
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      service.create([componentMockData, extraComponent], {});
      expect(watchFormArraySpy).toHaveBeenCalled();
      expect(emitChangesSpy).toHaveBeenCalled();
    });
    it('should create form', () => {
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      service.create([componentMockData, extraComponent], {});
      expect(service.form.length).toBe(2);
    });
  });

  describe('patch()', () => {
    it('should call convertedValue if value exists', () => {
      const dropDownsSpy = jest.spyOn(dictionaryToolsService.dropDowns$, 'getValue');
      const convertedValueSpy = jest.spyOn(componentsListToolsService, 'convertedValue');
      const component = JSON.parse(JSON.stringify(componentMockData));
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));

      component.type = CustomScreenComponentTypes.DropDown;
      component.attrs.defaultIndex = 0;
      component.value = 'SomeValue';

      service.create([componentMockData, extraComponent], {});
      service.patch(component);

      expect(dropDownsSpy).not.toHaveBeenCalled();
      expect(convertedValueSpy).toHaveBeenCalled();
    });

    describe('when component has no value', () => {
      const setup = (type = CustomScreenComponentTypes.DropDown, attrs = { defaultIndex: 0 }) => {
        const dropDownsSpy = jest.spyOn(dictionaryToolsService.dropDowns$, 'getValue');
        const convertedValueSpy = jest.spyOn(componentsListToolsService, 'convertedValue');
        const component = JSON.parse(JSON.stringify(componentMockData));
        const extraComponent = JSON.parse(JSON.stringify(componentMockData));
        const getDictionariesSpy = jest.fn(() => ({
          [`${component.attrs.dictionaryType}${component.id}`]: {
            list: [
              { id: 'index 0' },
              { id: 'test' },
            ]
          }
        }));

        Object.defineProperty(dictionaryToolsService, 'dictionaries', {
          get: getDictionariesSpy,
          set: jest.fn()
        });

        extraComponent.id = 'someID';
        component.type = type;
        component.attrs = { ...component.attrs, ...attrs };
        component.value = undefined;
        service.create([component, extraComponent], {});

        const control = service.form.controls.find((ctrl) => ctrl.value.id === component.id);
        const controlPatchSpy = jest.spyOn(control.get('value'), 'patchValue');

        return { convertedValueSpy, dropDownsSpy, component, getDictionariesSpy, control, controlPatchSpy };
      };

      it('should call dictionaryToolsService.dropDowns$.getValue(), if component type isDropdownLike, has defaultIndex and no value', () => {
        const { dropDownsSpy, component } = setup();
        service.patch(component);
        expect(dropDownsSpy).toHaveBeenCalled();
      });

      it('should call componentsListToolsService.convertedValue(), if component type is something else', () => {
        const { convertedValueSpy, component } = setup();
        service.patch(component);
        expect(convertedValueSpy).toHaveBeenCalled();
      });

      it('should pass defaultIndex if it is provided', () => {
        const { getDictionariesSpy, controlPatchSpy, component } = setup(CustomScreenComponentTypes.Lookup);

        service.patch(component);
        expect(getDictionariesSpy).toHaveBeenCalled();
        expect(controlPatchSpy).toHaveBeenCalledWith({ id: 'index 0' });
      });

      it('should pass lookupDefaultValue if it is provided', () => {
        const { getDictionariesSpy, controlPatchSpy, component } = setup(CustomScreenComponentTypes.Lookup, { lookupDefaultValue: 'test' });

        service.patch(component);
        expect(getDictionariesSpy).toHaveBeenCalled();
        expect(controlPatchSpy).toHaveBeenCalledWith({ id: 'test' });
      });
    });
  });

  describe('emitChanges()', () => {
    it('should call getPreparedStateForSending() and emit() changes', () => {
      const getPreparedStateForSendingSpy = jest.spyOn(service, 'getPreparedStateForSending');
      const emitSpy = jest.spyOn(service['_changes'], 'emit');
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      service.create([componentMockData, extraComponent], {});
      service.emitChanges();
      expect(getPreparedStateForSendingSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('addressHelperServiceProvider()', () => {
    it('should call addressHelperService.getProvider()', () => {
      const addressHelperServiceSpy = jest.spyOn(addressHelperService, 'getProvider');
      service.addressHelperServiceProvider(componentMockData.attrs);
      expect(addressHelperServiceSpy).toHaveBeenCalled();
    });
  });

  describe('getPreparedStateForSending()', () => {
    it('should return CustomComponentOutputData', () => {
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      service.create([componentMockData, extraComponent], {});
      const result = {
        rf1: { value: 'value', isValid: false, disabled: false, condition: null },
      };
      service.shownElements['rf1'].isShown = true;
      expect(service['getPreparedStateForSending']()).toEqual(result);
    });
  });

  describe('relationRegExp()', () => {
    it('should return array string', () => {
      const value = '2020.01.01';
      const params = /.*/;
      expect(service['relationRegExp'](value, params)[0]).toEqual('2020.01.01');
    });
  });

  describe('relationMinDate()', () => {
    it('should return true', () => {
      const value = new Date('2020.01.01');
      const params = '01.01.2010';
      expect(service['relationMinDate'](value, params)).toBeTruthy();
    });
    it('should return false', () => {
      const value = new Date('2010.01.01');
      const params = '01.01.2020';
      expect(service['relationMinDate'](value, params)).toBeFalsy();
    });
  });

  describe('relationMaxDate()', () => {
    it('should return true', () => {
      const value = new Date('2010.01.01');
      const params = '01.01.2020';
      expect(service['relationMaxDate'](value, params)).toBeTruthy();
    });
    it('should return false', () => {
      const value = new Date('2020.01.01');
      const params = '01.01.2010';
      expect(service['relationMaxDate'](value, params)).toBeFalsy();
    });
  });

  describe('relationPatch()', () => {
    it('should call changeValidators()', () => {
      const changeValidatorsSpy = jest.spyOn(service, 'changeValidators');
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      const { id, label, required, type, value, attrs } = JSON.parse(
        JSON.stringify(componentMockData),
      );
      const next: CustomListFormGroup = {
        attrs,
        id,
        label,
        required,
        type,
        value,
      };
      next.attrs.relationField = {
        ref: 'rf1',
        conditions: [
          {
            type: 'RegExp',
            value: '.*',
            result: {
              attrs: { ...attrs },
            },
          },
        ],
      };
      service.create([componentMockData, extraComponent], {});
      service['relationPatch'](componentMockData, {});
      expect(changeValidatorsSpy).toHaveBeenCalled();
    });
  });

  describe('resetRelation()', () => {
    it('should call relationPatch()', () => {
      const relationPatchSpy = jest.spyOn(service, 'relationPatch');
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      const { id, label, required, type, value, attrs } = JSON.parse(
        JSON.stringify(componentMockData),
      );
      const next: CustomListFormGroup = {
        attrs,
        id,
        label,
        required,
        type,
        value,
      };
      next.attrs.relationField = {
        ref: 'rf1',
        conditions: [
          {
            type: 'RegExp',
            value: '.*',
            result: {
              attrs: { ...attrs },
            },
          },
        ],
      };
      service.create([componentMockData, extraComponent], {});
      service['relationMapChanges'](next);
      service['resetRelation'](componentMockData);
      expect(relationPatchSpy).toHaveBeenCalled();
    });
  });

  describe('setRelationResult()', () => {
    it('should call resetRelation, if result is not passed', () => {
      const resetRelationSpy = jest.spyOn(service, 'resetRelation');
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      const { id, label, required, type, value, attrs } = JSON.parse(
        JSON.stringify(componentMockData),
      );
      const next: CustomListFormGroup = {
        attrs,
        id,
        label,
        required,
        type,
        value,
      };
      next.attrs.relationField = {
        ref: 'rf1',
        conditions: [
          {
            type: 'RegExp',
            value: '.*',
            result: {
              attrs: { ...attrs },
            },
          },
        ],
      };
      service.create([componentMockData, extraComponent], {});
      service['relationMapChanges'](next);
      service['setRelationResult'](componentMockData);
      expect(resetRelationSpy).toHaveBeenCalled();
    });
    it('should call relationPatch, if result is passed', () => {
      const relationPatchSpy = jest.spyOn(service, 'relationPatch');
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      const { id, label, required, type, value, attrs } = JSON.parse(
        JSON.stringify(componentMockData),
      );
      const next: CustomListFormGroup = {
        attrs,
        id,
        label,
        required,
        type,
        value,
      };
      next.attrs.relationField = {
        ref: 'rf1',
        conditions: [
          {
            type: 'RegExp',
            value: '.*',
            result: {
              attrs: { ...attrs },
            },
          },
        ],
      };
      service.create([componentMockData, extraComponent], {});
      service['relationMapChanges'](next);
      service['setRelationResult'](componentMockData);
      expect(relationPatchSpy).toHaveBeenCalled();
    });
  });

  describe('relationMapChanges()', () => {
    it('should call setRelationResult(), if component value and relationField are not empty', () => {
      const setRelationResultSpy = jest.spyOn(service, 'setRelationResult');
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      const { id, label, required, type, value, attrs } = JSON.parse(
        JSON.stringify(componentMockData),
      );
      const next: CustomListFormGroup = {
        attrs,
        id,
        label,
        required,
        type,
        value,
      };
      next.attrs.relationField = {
        ref: 'rf1',
        conditions: [
          {
            type: 'RegExp',
            value: '.*',
            result: {
              attrs: { ...attrs },
            },
          },
        ],
      };
      service.create([componentMockData, extraComponent], {});
      service['relationMapChanges'](next);
      expect(setRelationResultSpy).toHaveBeenCalled();
    });
    it('should not call setRelationResult(), if component value or relationField are empty', () => {
      const setRelationResultSpy = jest.spyOn(service, 'setRelationResult');
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      const { id, label, required, type, value, attrs } = JSON.parse(
        JSON.stringify(componentMockData),
      );
      const next: CustomListFormGroup = {
        attrs,
        id,
        label,
        required,
        type,
        value,
      };
      service.create([componentMockData, extraComponent], {});
      service['relationMapChanges'](next);
      expect(setRelationResultSpy).not.toHaveBeenCalled();
    });
  });

  describe('createGroup()', () => {
    it('should return FormGroup', () => {
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      expect(
        service['createGroup'](componentMockData, [componentMockData, extraComponent], null),
      ).toBeInstanceOf(FormGroup);
    });
    it('should return disabled form, if component attrs hidden', () => {
      const mockComponent = JSON.parse(JSON.stringify(componentMockData));
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      mockComponent.attrs.hidden = true;
      const form = service['createGroup'](mockComponent, [mockComponent, extraComponent], null);
      expect(form.disabled).toBe(true);
    });
  });

  describe('checkAndFetchCarModel()', () => {
    it('should call dictionaryToolsService.getDictionaries$() and initDictionary(), if MARKI_TS has place', () => {
      const getDictionariesSpy = jest.spyOn(dictionaryToolsService, 'getDictionaries$');
      const initDictionarySpy = jest.spyOn(dictionaryToolsService, 'initDictionary');
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      extraComponent.attrs.dictionaryType = 'MODEL_TS';
      const { id, label, required, type, value, attrs } = componentMockData;
      const prev: CustomListFormGroup = {
        attrs,
        id,
        label,
        required,
        type,
        value,
      };
      const next: CustomListFormGroup = JSON.parse(JSON.stringify(prev));
      next.value = 'new_value';
      service.create([component.componentMockData, extraComponent], {});
      service['checkAndFetchCarModel'](next, prev);
      expect(getDictionariesSpy).toHaveBeenCalled();
      expect(initDictionarySpy).toHaveBeenCalled();
    });
  });

  describe('watchFormGroup$()', () => {
    it('should return observable', () => {
      expect(service['watchFormGroup$'](component.form)).toBeInstanceOf(Observable);
    });
  });

  describe('watchFormArray$()', () => {
    it('should return observable', () => {
      expect(service['watchFormArray$']()).toBeInstanceOf(Observable);
    });
  });

  describe('updateOnValidation()', () => {
    it('should return default "change" attribute of component, if updateOnValidation is not set', () => {
      const component = JSON.parse(JSON.stringify(componentMockData));
      delete component.attrs.updateOnValidation;
      expect(service['updateOnValidation'](component)).toBe('change');
    });
    it('should return UpdateOn attribute of component', () => {
      expect(service['updateOnValidation'](componentMockData)).toBe('change');
    });
  });
});
