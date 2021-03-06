import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule, MockProvider } from 'ng-mocks';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  DatesToolsService,
  ErrorModule,
  InputErrorModule,
  ConstructorLookupComponent,
  DatesToolsServiceStub,
  DATE_STRING_DOT_FORMAT,
} from '@epgu/epgu-constructor-ui-kit';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaritalStatusInputComponent } from './marital-status-input.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ActDateInputComponent } from './components/act-date-input/act-date-input.component';
import { ActNumberInputComponent } from './components/act-number-input/act-number-input.component';
import { ActRegistratorInputComponent } from './components/act-registrator-input/act-registrator-input.component';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ValidationServiceStub } from '../../../../shared/services/validation/validation.service.stub';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { DateRestrictionsService } from '../../../../shared/services/date-restrictions/date-restrictions.service';
import { ValidationTypeModule } from '../../../../shared/directives/validation-type/validation-type.module';
import { ConstructorDatePickerModule } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMaskedInputModule } from '../../../../shared/components/constructor-masked-input/constructor-masked-input.module';
import { DictionaryService } from '../../../../shared/services/dictionary/dictionary.service';
import { DictionaryServiceStub } from '../../../../shared/services/dictionary/dictionary.service.stub';

const mockComponent = {
  id: 'pd6',
  type: 'MaritalStatusInput',
  label: '',
  attrs: {
    fields: [
      {
        fieldName: 'act_rec_date',
        label: '???????? ?????????????? ????????????',
        type: 'input',
        attrs: {},
      },
      {
        fieldName: 'act_rec_number',
        label: '?????????? ?????????????? ????????????',
        type: 'input',
        required: true,
        attrs: {},
      },
      {
        fieldName: 'act_rec_registrator',
        label: '?????????? ????????, ?????????????????????? ?????????????? ????????????',
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
      {
        fieldName: 'series',
        label: '??????????',
        type: 'input',
        attrs: {},
      },
      {
        fieldName: 'number',
        label: '??????????',
        type: 'input',
        attrs: {},
      },
      {
        fieldName: 'issueDate',
        label: '???????? ???????????? ??????????????????????????',
        type: 'input',
        attrs: {
          accuracy: 'day',
          maxDate: 'today',
          validation: [
            {
              type: 'RegExp',
              value: '.*',
              ref: '',
              condition: '',
              errorMsg: '???????? ???????????? ???????? ??????????????????',
            },
            {
              type: 'Date',
              condition: '<',
              errorMsg: '???????? ???? ?????????? ???????? ????????????, ?????? ???????? ???????????????? ?????????????????? + 14 ??????',
            },
            {
              type: 'maxDate',
              ref: '',
              value: 'TODAY',
              add: {},
            },
          ],
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
  let component: MaritalStatusInputComponent;
  let fixture: ComponentFixture<MaritalStatusInputComponent>;
  let control: FormGroup;
  let valueControl: FormControl;

  beforeEach(() => {
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
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: DictionaryService, useClass: DictionaryServiceStub },
        MockProvider(SuggestHandlerService),
        FormBuilder,
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
    formService._form = new FormArray([control]);

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
        label: new FormControl('?????????????????????????? ?? ??????????'),
      });
      formService._form = new FormArray([control]);

      fixture.detectChanges();

      component.ngOnInit();

      const selector = '.marital-status-input__title';
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.nativeElement.textContent).toEqual('?????????????????????????? ?? ??????????');
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
      const addFormSpy = jest.spyOn<MaritalStatusInputComponent, any>(
        component,
        'addFormGroupControls',
      );

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
          text: '?????????????????????????? ?????????????????? ?????????????????? ?????????? ???????????????? ?????????????????????? ???????????? ????',
          originalItem: {
            pr3: 'false',
            code: 'R0500092',
            fullname: '?????????????????????????? ?????????????????? ?????????????????? ?????????? ???????????????? ?????????????????????? ???????????? ????',
            dataN: '2003-01-01',
          },
        },
        issueDate: '2023-10-04',
        number: '342442',
        series: 'C-????',
      };

      const expectedValue = {
        act_rec_date: new Date('2016-07-01T08:00:00.000Z'),
        act_rec_number: 123321,
        act_rec_registrator: {
          id: 'R0500092',
          text: '?????????????????????????? ?????????????????? ?????????????????? ?????????? ???????????????? ?????????????????????? ???????????? ????',
          originalItem: {
            pr3: 'false',
            code: 'R0500092',
            fullname: '?????????????????????????? ?????????????????? ?????????????????? ?????????? ???????????????? ?????????????????????? ???????????? ????',
            dataN: '2003-01-01',
          },
        },
        issueDate: '2023-10-04',
        number: '342442',
        series: 'C-????',
      };
      const emitToParentSpy = jest.spyOn(component, 'emitToParentForm');
      const subscribeSpy = jest.spyOn(component, 'subscribeOnFormChange');

      component.ngOnInit();
      expect(subscribeSpy).toHaveBeenCalled();

      component.form.patchValue(formValueMock);
      expect(emitToParentSpy).toHaveBeenCalledWith(expectedValue);
    });

    it('should process date fields according to transfer contract', () => {
      const formValueMock = {
        act_rec_date: new Date('2016-07-01T08:00:00.000Z'),
      };
      const formattingSpy = jest.spyOn(component['datesToolsService'], 'format');
      component.form.patchValue(formValueMock);

      component.ngOnInit();

      expect(formattingSpy).toHaveBeenCalledTimes(1);
    });

    it('should correctly process dot format', () => {
      const formValueMock = {
        act_rec_date: '07.08.2021',
      };
      const stub1 = jest
        .spyOn(component, 'getParsedComponentValues' as any)
        .mockReturnValue(formValueMock);
      const stub2 = jest
        .spyOn(component['datesToolsService'], 'isDateStringDotFormat')
        .mockReturnValue(true);
      const spy = jest.spyOn(component['datesToolsService'], 'parse');

      component.ngOnInit();

      expect(spy).toHaveBeenCalledWith(formValueMock.act_rec_date, DATE_STRING_DOT_FORMAT);
    });

    it('should update parent if form is not VALID', () => {
      jest.spyOn(component, 'updateParentIfNotValid');

      component.ngOnInit();

      expect(component.updateParentIfNotValid).toHaveBeenCalled();
    });

    it('should fill fieldsNames array with fieldName', () => {
      component.fieldsNames = [];
      expect(component.fieldsNames.length).toEqual(0);

      component.ngOnInit();

      expect(component.fieldsNames.length).toEqual(mockComponent.attrs.fields.length);
    });
  });

  describe('group-item render', () => {
    const selector = '.marital-status-input__group-item';

    it('should render group items equivalent "attrs.fields"', () => {
      const groupItems = fixture.debugElement.queryAll(By.css(selector));

      expect(groupItems.length).toEqual(mockComponent.attrs.fields.length);
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
          text: '?????????????????????????? ?????????????????? ?????????????????? ?????????? ???????????????? ?????????????????????? ???????????? ????',
          originalItem: {
            pr3: 'false',
            code: 'R0500092',
            fullname: '?????????????????????????? ?????????????????? ?????????????????? ?????????? ???????????????? ?????????????????????? ???????????? ????',
            dataN: '2003-01-01',
          },
        },
        issueDate: '2023-10-04',
        number: '342442',
        series: 'C-????',
      };

      const expectedValue = {
        act_rec_date: new Date('2016-07-01T08:00:00.000Z'),
        act_rec_number: 123321,
        act_rec_registrator: {
          id: 'R0500092',
          text: '?????????????????????????? ?????????????????? ?????????????????? ?????????? ???????????????? ?????????????????????? ???????????? ????',
          originalItem: {
            pr3: 'false',
            code: 'R0500092',
            fullname: '?????????????????????????? ?????????????????? ?????????????????? ?????????? ???????????????? ?????????????????????? ???????????? ????',
            dataN: '2003-01-01',
          },
        },
        issueDate: '2023-10-04',
        number: '342442',
        series: 'C-????',
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
          text: '?????????????????????????? ?????????????????? ?????????????????? ?????????? ???????????????? ?????????????????????? ???????????? ????',
          originalItem: {
            pr3: 'false',
            code: 'R0500092',
            fullname: '?????????????????????????? ?????????????????? ?????????????????? ?????????? ???????????????? ?????????????????????? ???????????? ????',
            dataN: '2003-01-01',
          },
        },
        issueDate: '2023-10-04',
        number: '342442',
        series: 'C-????',
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
