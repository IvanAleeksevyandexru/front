import { DecimalPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentsListFormService } from './components-list-form.service';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { ComponentsListToolsService } from '../components-list-tools/components-list-tools.service';
import { AddressHelperService } from '../../../../shared/services/address-helper/address-helper.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import {
  ActivatedRouteStub,
  ConfigService,
  LoggerService,
  UnsubscribeService,
  JsonHelperService,
  NumberMaskOptions,
  DatesToolsService,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ComponentsListRelationsService } from '../components-list-relations/components-list-relations.service';
import { RefRelationService } from '../../../../shared/services/ref-relation/ref-relation.service';
import {
  CustomComponent,
  CustomListFormGroup,
  CustomScreenComponentTypes,
  UpdateOn,
} from '../../components-list.types';
import { Observable, of } from 'rxjs';
import { Component, Input } from '@angular/core';
import { DateRestrictionsService } from '../../../../shared/services/date-restrictions/date-restrictions.service';
import { MaskTransformService } from '../../../../shared/services/mask-transform/mask-transform.service';
import { cloneDeep } from 'lodash';
import { TypeCastService } from '../../../../core/services/type-cast/type-cast.service';
import { MockProvider } from 'ng-mocks';
import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { DateRefService } from '../../../../core/services/date-ref/date-ref.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import DropdownModel from '../../components/dropdown/DropdownModel';
import LookupInputModel from '../../components/lookup-input/LookupInputModel';
import StringInputModel from '../../components/masked-and-plain-input/StringInputModel';
import DepartmentLookupModel from '../../components/department-lookup/DepartmentLookupModel';
import { RelationResolverService } from '../components-list-relations/relation-resolver.service';
import { ComponentsListRelationsServiceStub } from '../components-list-relations/components-list-relations.service.stub';
import { DictionaryService } from '../../../../shared/services/dictionary/dictionary.service';
import { DictionaryServiceStub } from '../../../../shared/services/dictionary/dictionary.service.stub';
import { ValidationServiceStub } from '../../../../shared/services/validation/validation.service.stub';
import { HelperService } from '@epgu/ui/services/helper';
import { ScreenButtonService } from '../../../../shared/components/screen-buttons/screen-button.service';
import { ScreenButtonServiceStub } from '../../../../shared/components/screen-buttons/screen-button.service.stub';

describe('ComponentsListFormService', () => {
  const componentsGroupIndex = 1;
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
      updateOnValidation: UpdateOn.ON_BLUR,
    },
    value: 'value',
    required: true,
  };
  let mockComponent: MockComponent;
  let addressHelperService: AddressHelperService;
  let componentsListToolsService: ComponentsListToolsService;
  let maskTransformService: MaskTransformService;
  let componentsListRelationsService: ComponentsListRelationsService;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: DictionaryService, useClass: DictionaryServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ValidationService, useClass: ValidationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ComponentsListRelationsService, useClass: ComponentsListRelationsServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ScreenButtonService, useClass: ScreenButtonServiceStub },
        DatesToolsService,
        DateRefService,
        ComponentsListFormService,
        CurrentAnswersService,
        UnsubscribeService,
        ComponentsListToolsService,
        AddressHelperService,
        LoggerService,
        DateRangeService,
        RelationResolverService,
        HttpClient,
        HttpHandler,
        RefRelationService,
        MockProvider(DateRestrictionsService),
        MockProvider(HelperService),
        ConfigService,
        MaskTransformService,
        DecimalPipe,
        TypeCastService,
        JsonHelperService,
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ComponentsListFormService);
    addressHelperService = TestBed.inject(AddressHelperService);
    componentsListToolsService = TestBed.inject(ComponentsListToolsService);
    maskTransformService = TestBed.inject(MaskTransformService);
    componentsListRelationsService = TestBed.inject(ComponentsListRelationsService);
    fixture = TestBed.createComponent(MockComponent);
    mockComponent = fixture.componentInstance;
    mockComponent.componentMockData = componentMockData;
    fixture.detectChanges();
    jest.spyOn(componentsListRelationsService, 'calculateVisibility').mockReturnValue({
      rf1: { isShown: true },
    });
  });

  describe('create()', () => {
    it('should call watchFormArray$() and emitChanges()', () => {
      const watchFormArraySpy = jest.spyOn<any, any>(service, 'watchFormArray$');
      const emitChangesSpy = jest.spyOn(service, 'emitChanges');
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      service.create([componentMockData, extraComponent], componentsGroupIndex);
      expect(watchFormArraySpy).toHaveBeenCalled();
      expect(emitChangesSpy).toHaveBeenCalled();
    });

    it('should create form', () => {
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      service.create([componentMockData, extraComponent], componentsGroupIndex);
      expect(service.form.length).toBe(2);
    });
  });

  describe('patch()', () => {
    const setup = (type, attrs: any = { defaultIndex: 0 }, value = '') => {
      const convertedValueSpy = jest.spyOn(componentsListToolsService, 'convertedValue');
      const component = type
        ? new type({ id: 'testable', attrs, type: CustomScreenComponentTypes.DropDown })
        : new DropdownModel({ id: 'testable', attrs, type: CustomScreenComponentTypes.DropDown });
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));

      extraComponent.id = 'someID';
      component.value = value;
      service.create([component, extraComponent], componentsGroupIndex);

      const control = service.form.controls.find((ctrl) => ctrl.value.id === component.id);
      const controlPatchSpy = jest.spyOn(control.get('value'), 'patchValue');

      return {
        convertedValueSpy,
        component,
        control,
        controlPatchSpy,
      };
    };

    describe('when mockComponent has value', () => {
      it('should call convertedValue if value exists', () => {
        const convertedValueSpy = jest.spyOn(componentsListToolsService, 'convertedValue');
        const { component } = setup(LookupInputModel, {}, 'val');
        service.patch(component);

        expect(convertedValueSpy).toHaveBeenCalled();
      });
    });

    describe('when mockComponent has no value', () => {
      it('should call dictionaryToolsService.dropDowns$.getValue(), if mockComponent type isDropdownLike, has defaultIndex and no value', () => {
        const { component } = setup(DropdownModel);
        const spy = jest
          .spyOn(component, 'patchControlValue')
          .mockImplementation((...args) => true);
        service.patch(component);
        expect(spy).toHaveBeenCalled();
      });

      it('should call componentsListToolsService.convertedValue(), if mockComponent type is something else', () => {
        const { convertedValueSpy, component } = setup(StringInputModel);
        service.patch(component);
        expect(convertedValueSpy).toHaveBeenCalled();
      });

      it('should pass defaultIndex if it is provided', () => {
        const { controlPatchSpy, component } = setup(LookupInputModel);
        component._dictionary$.next({ list: [1] } as any);
        service.patch(component);
        expect(controlPatchSpy).toHaveBeenCalledWith(1);
      });

      it('should pass lookupDefaultValue if it is provided', () => {
        const { controlPatchSpy, component } = setup(LookupInputModel, {
          lookupDefaultValue: 'index1',
        });
        component._dictionary$.next({ list: [{ id: 'index1' }] } as any);
        service.patch(component);
        expect(controlPatchSpy).toHaveBeenCalledWith({ id: 'index1' });
      });

      it('should pass lookupDefaultValue with lookupFilterPath if it is provided', () => {
        const { controlPatchSpy, component } = setup(LookupInputModel, {
          lookupDefaultValue: '40000000000',
          lookupFilterPath: 'originalItem.attributeValues.OKATO',
        });
        component._dictionary$.next({
          list: [{ originalItem: { attributeValues: { OKATO: '40000000000' } } }],
        } as any);
        service.patch(component);
        expect(controlPatchSpy).toHaveBeenCalledWith({
          originalItem: { attributeValues: { OKATO: '40000000000' } },
        });
      });
    });

    describe('when it is DropDownDepts and has defaultIndex', () => {
      it('should patchDropDownDeptsValue when lockedValue is true', () => {
        const { controlPatchSpy, component } = setup(DepartmentLookupModel, {
          defaultIndex: 0,
          lockedValue: true,
        });
        component._dictionary$.next({ list: [1] } as any);
        service.patch(component);

        expect(controlPatchSpy).toHaveBeenCalledTimes(1);
        expect(controlPatchSpy).toHaveBeenCalledWith(1);
      });

      it('should patchDropDownDeptsValue when there is one element', () => {
        const { controlPatchSpy, component } = setup(
          DepartmentLookupModel,
          { defaultIndex: 0, lockedValue: false },
          '1',
        );
        component._dictionary$.next({ list: [1] } as any);
        service.patch(component);

        expect(controlPatchSpy).toHaveBeenCalledTimes(1);
        expect(controlPatchSpy).toHaveBeenCalledWith(1);
      });

      it('should dont call patch when there is no value ', () => {
        const { controlPatchSpy, component } = setup(LookupInputModel, { lockedValue: false }, '');
        service.patch(component);
        expect(controlPatchSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('emitChanges()', () => {
    it('should call getPreparedStateForSending() and emit() changes', async () => {
      const getPreparedStateForSendingSpy = jest.spyOn<any, any>(
        service,
        'getPreparedStateForSending',
      );
      // @ts-ignore
      const emitSpy = jest.spyOn(service._changes, 'emit');
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      service.create([componentMockData, extraComponent], componentsGroupIndex);
      await service.emitChanges();
      expect(getPreparedStateForSendingSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalled();
    });

    it('should call transformNumberMaskInput if type equally StringInput and val.attrs.mask equally NumberMaskInput', async () => {
      const transformNumberMaskInput = jest.spyOn(maskTransformService, 'transformNumberMaskInput');
      const componentStub = cloneDeep(componentMockData);

      // @ts-ignore
      componentStub.attrs.mask = 'NumberMaskInput';
      componentStub.attrs.ref[0].relation = CustomComponentRefRelation.displayOff;
      componentStub.attrs.maskOptions = {
        decimalSymbol: ',',
        allowDecimal: true,
      } as NumberMaskOptions;
      componentStub.value = 'value';
      let component = JSON.parse(JSON.stringify(componentStub));
      service.create([componentStub, component], componentsGroupIndex);

      await service.emitChanges();
      expect(transformNumberMaskInput).toHaveBeenCalled();
      // @ts-ignore
      expect(service.getPreparedStateForSending()[componentStub.id].value).toEqual('0,00');

      componentStub.value = '123';
      component = JSON.parse(JSON.stringify(componentStub));
      service.create([componentStub, component], componentsGroupIndex);

      await service.emitChanges();
      // @ts-ignore
      expect(service.getPreparedStateForSending()[componentStub.id].value).toEqual('123,00');
    });
  });

  describe('addressHelperServiceProvider()', () => {
    it('should call addressHelperService.getProvider()', () => {
      const addressHelperServiceSpy = jest.spyOn(addressHelperService, 'getProvider');
      service.addressHelperServiceProvider(componentMockData.attrs);
      expect(addressHelperServiceSpy).toHaveBeenCalled();
    });
  });

  describe('markForFirstRoundValidation()', () => {
    it('should mark form controls as touched, if there are non-empty values ', () => {
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      service.create([componentMockData, extraComponent], componentsGroupIndex);
      // @ts-ignore
      service.markForFirstRoundValidation([extraComponent]);
      // @ts-ignore
      const result = service._form.controls.some((control) => control.touched);
      expect(result).toBeTruthy();
    });
  });

  describe('getPreparedStateForSending()', () => {
    it('should return CustomComponentOutputData', () => {
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      service.create([componentMockData, extraComponent], componentsGroupIndex);
      const result = {
        rf1: {
          value: 'value',
          isValid: false,
          disabled: false,
          condition: null,
        },
      };
      service.shownElements.rf1.isShown = true;
      // @ts-ignore
      expect(service.getPreparedStateForSending()).toEqual(result);
    });
  });

  describe('relationRegExp()', () => {
    it('should return array string', () => {
      const value = '2020.01.01';
      const params = /.*/;
      // @ts-ignore
      expect(service.relationRegExp(value, params)[0]).toEqual('2020.01.01');
    });
  });

  describe('relationMinDate()', () => {
    it('should return true', () => {
      const value = new Date('2020.01.01');
      const params = '01.01.2010';
      // @ts-ignore
      expect(service.relationMinDate(value, params)).toBeTruthy();
    });
    it('should return false', () => {
      const value = new Date('2010.01.01');
      const params = '01.01.2020';
      // @ts-ignore
      expect(service.relationMinDate(value, params)).toBeFalsy();
    });
  });

  describe('relationMaxDate()', () => {
    it('should return true', () => {
      const value = new Date('2010.01.01');
      const params = '01.01.2020';
      // @ts-ignore
      expect(service.relationMaxDate(value, params)).toBeTruthy();
    });
    it('should return false', () => {
      const value = new Date('2020.01.01');
      const params = '01.01.2010';
      // @ts-ignore
      expect(service.relationMaxDate(value, params)).toBeFalsy();
    });
  });

  describe('relationPatch()', () => {
    it('should call changeValidators()', () => {
      const changeValidatorsSpy = jest.spyOn<any, any>(service, 'changeValidators');
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
      service.create([componentMockData, extraComponent], componentsGroupIndex);
      // @ts-ignore
      service.relationPatch(componentMockData, {});
      expect(changeValidatorsSpy).toHaveBeenCalled();
    });
  });

  describe('resetRelation()', () => {
    it('should call relationPatch()', () => {
      const relationPatchSpy = jest.spyOn<any, any>(service, 'relationPatch');
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
      service.create([componentMockData, extraComponent], componentsGroupIndex);
      service.relationMapChanges(next);
      // @ts-ignore
      service.resetRelation(componentMockData);
      expect(relationPatchSpy).toHaveBeenCalled();
    });
  });

  describe('setRelationResult()', () => {
    it('should call resetRelation, if result is not passed', () => {
      const resetRelationSpy = jest.spyOn<any, any>(service, 'resetRelation');
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
      service.create([componentMockData, extraComponent], componentsGroupIndex);
      service.relationMapChanges(next);
      // @ts-ignore
      service.setRelationResult(componentMockData);
      expect(resetRelationSpy).toHaveBeenCalled();
    });
    it('should call relationPatch, if result is passed', () => {
      const relationPatchSpy = jest.spyOn<any, any>(service, 'relationPatch');
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
      service.create([componentMockData, extraComponent], componentsGroupIndex);
      service.relationMapChanges(next);
      // @ts-ignore
      service.setRelationResult(componentMockData);
      expect(relationPatchSpy).toHaveBeenCalled();
    });
  });

  describe('relationMapChanges()', () => {
    it('should call setRelationResult(), if mockComponent value and relationField are not empty', () => {
      const setRelationResultSpy = jest.spyOn<any, any>(service, 'setRelationResult');
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
      service.create([componentMockData, extraComponent], componentsGroupIndex);
      service.relationMapChanges(next);
      expect(setRelationResultSpy).toHaveBeenCalled();
    });
    it('should not call setRelationResult(), if mockComponent value or relationField are empty', () => {
      const setRelationResultSpy = jest.spyOn<any, any>(service, 'setRelationResult');
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
      service.create([componentMockData, extraComponent], componentsGroupIndex);
      service.relationMapChanges(next);
      expect(setRelationResultSpy).not.toHaveBeenCalled();
    });
  });

  describe('createGroup()', () => {
    it('should return FormGroup', () => {
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      expect(
        // @ts-ignore
        service.createGroup(componentMockData, [componentMockData, extraComponent], null),
      ).toBeInstanceOf(FormGroup);
    });
    it('should return disabled form, if mockComponent attrs hidden', () => {
      const component = JSON.parse(JSON.stringify(componentMockData));
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      component.attrs.hidden = true;
      // @ts-ignore
      const form = service.createGroup(component, [component, extraComponent], null);
      expect(form.disabled).toBe(true);
    });
  });

  describe('checkAndFetchCarModel()', () => {
    it('should call dictionaryService.getDictionaries$() and initDictionary(), if MARKI_TS has place', () => {
      const extraComponent = JSON.parse(JSON.stringify(componentMockData));
      extraComponent.attrs.dictionaryType = 'MODEL_TS';
      extraComponent.id = 'rf2';
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
      service.create(
        [
          new LookupInputModel(mockComponent.componentMockData),
          new LookupInputModel(extraComponent),
        ],
        componentsGroupIndex,
      );
      const spyControl = service.form.controls.find(
        (control) => control.value.id === extraComponent.id,
      );
      const spyMethod = jest
        .spyOn(spyControl.value.model, 'loadReferenceData$')
        .mockImplementation((...args) => of(null));
      // @ts-ignore
      service.checkAndFetchCarModel(next);
      expect(spyMethod).toHaveBeenCalled();
    });
  });

  describe('watchFormGroup$()', () => {
    it('should return observable', () => {
      // @ts-ignore
      expect(service.watchFormGroup$(mockComponent.form)).toBeInstanceOf(Observable);
    });
  });

  describe('watchFormArray$()', () => {
    it('should return observable', () => {
      // @ts-ignore
      expect(service.watchFormArray$()).toBeInstanceOf(Observable);
    });
  });
});
