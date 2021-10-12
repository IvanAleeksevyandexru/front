import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule, MockProvider } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MaritalStatusInputComponent } from './marital-status-input.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { BaseModule } from '../../../../shared/base.module';
import {
  DatesToolsService,
  ErrorModule,
  InputErrorModule,
  ConstructorLookupComponent,
} from '@epgu/epgu-constructor-ui-kit';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { DateRestrictionsService } from 'projects/epgu-constructor/src/lib/shared/services/date-restrictions/date-restrictions.service';
import { ConstructorDatePickerModule } from 'projects/epgu-constructor/src/lib/shared/components/constructor-date-picker/constructor-date-picker.module';
import { ConstructorPlainInputModule } from 'projects/epgu-constructor/src/lib/shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMaskedInputModule } from 'projects/epgu-constructor/src/lib/shared/components/constructor-masked-input/constructor-masked-input.module';
import { ValidationTypeModule } from 'projects/epgu-constructor/src/lib/shared/directives/validation-type/validation-type.module';
import { SuggestHandlerService } from 'projects/epgu-constructor/src/lib/shared/services/suggest-handler/suggest-handler.service';
import { By } from '@angular/platform-browser';
import { ActDateInputComponent } from './components/act-date-input/act-date-input.component';
import { ActNumberInputComponent } from './components/act-number-input/act-number-input.component';
import { ActRegistratorInputComponent } from './components/act-registrator-input/act-registrator-input.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ValidationServiceStub } from '../../../../shared/services/validation/validation.service.stub';

const mockComponent = {
  id: 'pd6',
  type: 'MaritalStatusInput',
  label: '',
  attrs: {
    fields: [
      {
        fieldName: 'act_rec_date',
        label: 'Дата актовой записи',
        type: 'input',
        attrs: {},
      },
      {
        fieldName: 'act_rec_number',
        label: 'Номер актовой записи',
        type: 'input',
        required: true,
        attrs: {},
      },
      {
        fieldName: 'act_rec_registrator',
        label: 'Орган ЗАГС, составивший актовую запись',
        attrs: {
          mappingParams: {
            idPath: 'code',
            textPath: 'fullname',
          },
          searchProvider: {
            dictionaryOptions: {
              pageSize: 100,
            },
            dictionaryFilter: [
              {
                attributeName: 'fullname',
                condition: 'CONTAINS',
                value: 'searchString',
                valueType: 'rawFilter',
              },
              {
                attributeName: 'dataN',
                condition: 'LESS_THAN_OR_EQUALS',
                value: 'act_rec_date',
                valueType: 'formValue',
                dateFormat: 'yyyy-MM-dd',
              },
              {
                attributeName: 'dataK',
                condition: 'GREATER_THAN_OR_EQUALS',
                value: 'act_rec_date',
                valueType: 'formValue',
                dateFormat: 'yyyy-MM-dd',
                trueForNull: true,
              },
            ],
          },
          dictionaryType: 'FNS_ZAGS_ALL',
          dictionaryUrlType: 'nsiSuggest',
        },
      },
    ],
  },
  value: '',
  visited: false,
  required: false,
};

describe('MaritalStatusInputComponent', () => {
  let formService: ComponentsListFormService;
  let datesToolsService: DatesToolsService;
  let component: MaritalStatusInputComponent;
  let fixture: ComponentFixture<MaritalStatusInputComponent>;
  let control: FormGroup;
  let valueControl: FormControl;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ActDateInputComponent,
        ActNumberInputComponent,
        ActRegistratorInputComponent,
        MaritalStatusInputComponent,
        ConstructorLookupComponent,
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: ValidationService, useClass: ValidationServiceStub },
        MockProvider(SuggestHandlerService),
        FormBuilder,
        MockProvider(DatesToolsService),
        MockProvider(DictionaryToolsService),
        MockProvider(DateRestrictionsService),
      ],
      imports: [
        HttpClientTestingModule,
        MockModule(ValidationTypeModule),
        MockModule(ConstructorDatePickerModule),
        MockModule(BaseComponentsModule),
        MockModule(ConstructorPlainInputModule),
        MockModule(ConstructorMaskedInputModule),
        MockModule(ErrorModule),
        MockModule(BaseModule),
        MockModule(InputErrorModule),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    formService = TestBed.inject(ComponentsListFormService);
    datesToolsService = TestBed.inject(DatesToolsService);
    fixture = TestBed.createComponent(MaritalStatusInputComponent);
    component = fixture.componentInstance;
    component.componentIndex = 0;

    valueControl = new FormControl(mockComponent.value);
    control = new FormGroup({
      id: new FormControl(mockComponent.id),
      attrs: new FormControl(mockComponent.attrs),
      value: valueControl,
      required: new FormControl(mockComponent.required),
    });
    formService['_form'] = new FormArray([control]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  describe('Init', () => {
    it('should render title if there is in the component', () => {
      fixture = TestBed.createComponent(MaritalStatusInputComponent);
      component = fixture.componentInstance;
      component.componentIndex = 0;

      valueControl = new FormControl(mockComponent.value);
      control = new FormGroup({
        id: new FormControl(mockComponent.id),
        attrs: new FormControl(mockComponent.attrs),
        value: valueControl,
        required: new FormControl(mockComponent.required),
        label: new FormControl('Свидетельство о браке'),
      });
      formService['_form'] = new FormArray([control]);

      fixture.detectChanges();

      component.ngOnInit();

      const selector = '.marital-status-input__title';
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.nativeElement.textContent).toEqual('Свидетельство о браке');
    });

    it('should not render title if there is not in the component', () => {
      component.ngOnInit();

      const selector = '.marital-status-input__title';
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeFalsy();
    });

    it('should set fields from component attrs', () => {
      component.ngOnInit();

      expect(component.fields).toEqual(mockComponent.attrs.fields);
    });

    it('should create the form', () => {
      const addFormSpy = jest.spyOn(component, 'addFormGroupControls');

      component.ngOnInit();

      expect(addFormSpy).toHaveBeenCalled();
      expect(component.form).toBeDefined();
    });

    it('should subscribe on form valueChanges', () => {
      const formValueMock = {
        act_rec_date: new Date('2016-07-01T08:00:00.000Z'),
        act_rec_number: 123321,
        act_rec_registrator: {
          id: 'R0500092',
          text: 'Администрация сельского поселения «село Гагатли» Ботлихского района РД',
          originalItem: {
            pr3: 'false',
            code: 'R0500092',
            fullname: 'Администрация сельского поселения «село Гагатли» Ботлихского района РД',
            dataN: '2003-01-01',
          },
        },
      };

      const expectedValue = {
        act_rec_date: new Date('2016-07-01T08:00:00.000Z'),
        act_rec_number: 123321,
        act_rec_registrator: {
          id: 'R0500092',
          text: 'Администрация сельского поселения «село Гагатли» Ботлихского района РД',
          originalItem: {
            pr3: 'false',
            code: 'R0500092',
            fullname: 'Администрация сельского поселения «село Гагатли» Ботлихского района РД',
            dataN: '2003-01-01',
          },
        },
      };
      const emitToParentSpy = jest.spyOn(component, 'emitToParentForm');
      const subscribeSpy = jest.spyOn(component, 'subscribeOnFormChange');

      component.ngOnInit();
      expect(subscribeSpy).toHaveBeenCalled();

      component.form.patchValue(formValueMock);
      expect(emitToParentSpy).toHaveBeenCalledWith(expectedValue);
    });

    it('should update parent if form is not VALID', () => {
      jest.spyOn(component, 'updateParentIfNotValid');

      component.ngOnInit();

      expect(component.updateParentIfNotValid).toHaveBeenCalled();
    });
  });

  describe('Controls', () => {
    it('should mark control as dirty', () => {
      const controlName = 'act_rec_number';

      component.ngOnInit();
      expect(component.form.controls[controlName].dirty).toBeFalsy();

      component.markControlAsDirty(controlName);
      expect(component.form.controls[controlName].dirty).toBeTruthy();
    });
  });

  describe('Form value changes', () => {
    it('should set value to control if form is VALID', () => {
      const formValueMock = {
        act_rec_date: new Date('2016-07-01T08:00:00.000Z'),
        act_rec_number: 123321,
        act_rec_registrator: {
          id: 'R0500092',
          text: 'Администрация сельского поселения «село Гагатли» Ботлихского района РД',
          originalItem: {
            pr3: 'false',
            code: 'R0500092',
            fullname: 'Администрация сельского поселения «село Гагатли» Ботлихского района РД',
            dataN: '2003-01-01',
          },
        },
      };

      const expectedValue = {
        act_rec_date: new Date('2016-07-01T08:00:00.000Z'),
        act_rec_number: 123321,
        act_rec_registrator: {
          id: 'R0500092',
          text: 'Администрация сельского поселения «село Гагатли» Ботлихского района РД',
          originalItem: {
            pr3: 'false',
            code: 'R0500092',
            fullname: 'Администрация сельского поселения «село Гагатли» Ботлихского района РД',
            dataN: '2003-01-01',
          },
        },
      };
      const emitChangesSpy = jest.spyOn(formService, 'emitChanges');

      component.ngOnInit();
      component.form.patchValue(formValueMock);
      fixture.detectChanges();

      expect(component.form.valid).toBeTruthy();
      expect(component.control.get('value').value).toEqual(expectedValue);
      expect(emitChangesSpy).toHaveBeenCalled();
    });

    it('should set errors to control if form is INVALID', () => {
      const formValueMock = {
        act_rec_date: new Date('2016-07-01T08:00:00.000Z'),
        act_rec_number: null,
        act_rec_registrator: {
          id: 'R0500092',
          text: 'Администрация сельского поселения «село Гагатли» Ботлихского района РД',
          originalItem: {
            pr3: 'false',
            code: 'R0500092',
            fullname: 'Администрация сельского поселения «село Гагатли» Ботлихского района РД',
            dataN: '2003-01-01',
          },
        },
      };
      const emitChangesSpy = jest.spyOn(formService, 'emitChanges');

      component.ngOnInit();
      component.form.patchValue(formValueMock);
      fixture.detectChanges();

      expect(component.form.valid).toBeFalsy();
      expect(component.control.get('value').errors).toEqual({ invalidForm: true });
      expect(emitChangesSpy).toHaveBeenCalled();
    });
  });
});
