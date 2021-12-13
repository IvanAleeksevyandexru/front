import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule, MockProvider } from 'ng-mocks';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ConfigService,
  DatesToolsService,
  LoggerService,
  ErrorModule,
  InputErrorModule,
  EventBusService,
  ActivatedRouteStub,
} from '@epgu/epgu-constructor-ui-kit';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DocInputComponent } from './doc-input.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { ValidationServiceStub } from '../../../../shared/services/validation/validation.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { DateRestrictionsService } from '../../../../shared/services/date-restrictions/date-restrictions.service';
import { ConstructorDatePickerModule } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMaskedInputModule } from '../../../../shared/components/constructor-masked-input/constructor-masked-input.module';
import { ValidationTypeModule } from '../../../../shared/directives/validation-type/validation-type.module';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { SuggestMonitorService } from '../../../../shared/services/suggest-monitor/suggest-monitor.service';
import { AutocompleteService } from '../../../../core/services/autocomplete/autocomplete.service';

const mockComponent = {
  id: 'pd6',
  type: 'DocInput',
  label: '',
  attrs: {
    fields: {},
  },
  value: {
    seriesNumDate: {
      date: null,
      number: null,
      series: null,
    },
    emitter: null,
  },
  visited: false,
  required: false,
};

describe('DocInputComponent', () => {
  let formService: ComponentsListFormService;
  let datesToolsService: DatesToolsService;
  let component: DocInputComponent;
  let fixture: ComponentFixture<DocInputComponent>;
  let control: FormGroup;
  let valueControl: FormControl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocInputComponent],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ValidationService, useClass: ValidationServiceStub },
        MockProvider(AutocompleteService),
        MockProvider(ConfigService),
        MockProvider(CurrentAnswersService),
        MockProvider(DateRangeService),
        MockProvider(DateRestrictionsService),
        DatesToolsService,
        MockProvider(EventBusService),
        MockProvider(LoggerService),
        MockProvider(SuggestHandlerService),
        MockProvider(SuggestMonitorService),
        FormBuilder,
      ],
      imports: [
        MockModule(BaseComponentsModule),
        MockModule(BaseModule),
        MockModule(ConstructorDatePickerModule),
        MockModule(ConstructorMaskedInputModule),
        MockModule(ConstructorPlainInputModule),
        MockModule(ErrorModule),
        MockModule(InputErrorModule),
        MockModule(ValidationTypeModule),
        HttpClientModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    formService = TestBed.inject(ComponentsListFormService);
    datesToolsService = TestBed.inject(DatesToolsService);
    fixture = TestBed.createComponent(DocInputComponent);
    component = fixture.componentInstance;
    component.componentIndex = 0;
    mockComponent.attrs.fields = {
      series: {
        attrs: {
          validation: [
            {
              type: 'RegExp',
              value: '.*',
              ref: '',
              condition: '',
              errorMsg: 'Поле должно быть заполено',
            },
            {
              type: 'RegExp',
              value: '^.{4}$',
              ref: '',
              dataType: '',
              condition: '',
              errorMsg: 'Поле должно содержать 4 символа',
              updateOn: 'blur',
            },
          ],
        },
      },
      number: { attrs: { validation: [] } },
      emitter: { attrs: { validation: [] } },
      date: { attrs: { validation: [] } },
    };

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
      fixture = TestBed.createComponent(DocInputComponent);
      component = fixture.componentInstance;
      component.componentIndex = 0;

      valueControl = new FormControl(mockComponent.value);
      control = new FormGroup({
        id: new FormControl(mockComponent.id),
        attrs: new FormControl(mockComponent.attrs),
        value: valueControl,
        required: new FormControl(mockComponent.required),
        label: new FormControl('Паспорт РФ'),
      });
      formService._form = new FormArray([control]);

      fixture.detectChanges();

      component.ngOnInit();

      const selector = '.doc-input__title';
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.nativeElement.textContent).toEqual('Паспорт РФ');
    });

    it('should not render title if there is not in the component', () => {
      component.ngOnInit();

      const selector = '.doc-input__title';
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeFalsy();
    });

    it('should set fields from component attrs', () => {
      component.ngOnInit();

      expect(component.fields).toEqual(mockComponent.attrs.fields);
    });

    it('should change expiration date if expirationDate field existing', () => {
      expect(component.hasExpirationDate).toBeFalsy();
      mockComponent.attrs.fields.expirationDate = { attrs: { validation: [] } };

      component.ngOnInit();

      expect(component.hasExpirationDate).toBeTruthy();
    });

    it('should create the form', () => {
      jest.spyOn(component, 'addFormGroupControls');

      component.ngOnInit();

      expect(component.addFormGroupControls).toHaveBeenCalled();
      expect(component.form).toBeDefined();
    });

    it('should subscribe on form valueChanges', () => {
      const formValueMock = {
        seriesNumDate: {
          date: new Date('2016-07-01T08:00:00.000Z'),
          number: 123321,
          series: 8000,
        },
        emitter: 'Отделением ОФМС',
        issueId: '778899',
      };

      const expectedValue = {
        date: datesToolsService.format(new Date('2016-07-01T08:00:00.000Z')),
        number: 123321,
        series: 8000,
        emitter: 'Отделением ОФМС',
        issueId: '778899',
      };
      jest.spyOn(component, 'emitToParentForm');
      jest.spyOn(component, 'subscribeOnFormChange');

      component.ngOnInit();
      expect(component.subscribeOnFormChange).toHaveBeenCalled();

      component.form.patchValue(formValueMock);
      expect(component.emitToParentForm).toHaveBeenCalledWith(expectedValue);
    });

    it('should update parent if form is not VALID', () => {
      jest.spyOn(component, 'updateParentIfNotValid');

      component.ngOnInit();

      expect(component.updateParentIfNotValid).toHaveBeenCalled();
    });
  });

  describe('Controls', () => {
    it('shoud mark control as dirty', () => {
      const controlName = 'emitter';

      component.ngOnInit();
      expect(component.form.controls[controlName].dirty).toBeFalsy();

      component.markControlAsDirty(controlName);
      expect(component.form.controls[controlName].dirty).toBeTruthy();
    });
  });

  describe('Form value changes', () => {
    it('should format form fields', () => {
      const formValueMock = {
        seriesNumDate: {
          date: new Date('2016-07-01T08:00:00.000Z'),
          number: 123321,
          series: 8000,
        },
        emitter: 'Отделением ОФМС',
        issueId: '778899',
      };

      const expectedValue = {
        date: datesToolsService.format(new Date('2016-07-01T08:00:00.000Z')),
        number: 123321,
        series: 8000,
        emitter: 'Отделением ОФМС',
        issueId: '778899',
      };
      jest.spyOn(component, 'formatFormFields');

      component.ngOnInit();
      component.form.patchValue(formValueMock);
      fixture.detectChanges();

      expect(component.formatFormFields).toBeCalledWith(formValueMock);
      expect(component.formatFormFields).toReturnWith(expectedValue);
    });

    it('should set value to control if form is VALID', () => {
      const formValueMock = {
        seriesNumDate: {
          date: new Date('2016-07-01T08:00:00.000Z'),
          number: 123321,
          series: 8000,
        },
        emitter: 'Отделением ОФМС',
        issueId: '778899',
      };

      const expectedValue = {
        date: datesToolsService.format(new Date('2016-07-01T08:00:00.000Z')),
        number: 123321,
        series: 8000,
        emitter: 'Отделением ОФМС',
        issueId: '778899',
      };
      jest.spyOn(formService, 'emitChanges');

      component.ngOnInit();
      component.form.patchValue(formValueMock);
      fixture.detectChanges();

      expect(component.form.valid).toBeTruthy();
      expect(component.control.get('value').value).toEqual(expectedValue);
      expect(formService.emitChanges).toHaveBeenCalled();
    });

    it('should set errors to control if form is INVALID', () => {
      const formValueMock = {
        seriesNumDate: {
          date: null,
          number: 123321,
          series: 89775,
        },
        emitter: 'Отделением ОФМС',
      };
      jest.spyOn(formService, 'emitChanges');

      component.ngOnInit();
      component.form.patchValue(formValueMock);
      fixture.detectChanges();

      expect(component.form.valid).toBeFalsy();
      expect(component.control.get('value').errors).toEqual({ invalidForm: true });
      expect(formService.emitChanges).toHaveBeenCalled();
    });
  });

  it('prepareDate should work correct', () => {
    let date1 = new Date('2025-09-06T00:00:00.000Z');
    let date2 = component.prepareDate('2025-09-06T00:00:00.000Z');
    let res = datesToolsService.isEqual(date1, date2);
    expect(res).toBeTruthy();
    date1 = new Date('02.01.2020');
    date2 = component.prepareDate('01.02.2020');
    res = datesToolsService.isEqual(date1, date2);
    expect(res).toBeTruthy();
  });
});
