import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule, MockProvider } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmPersonalPolicyChangeComponent } from './confirm-personal-policy-change.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { BaseModule } from '../../../../shared/base.module';
import {
  ConfigService,
  LoggerService,
  ErrorModule,
  InputErrorModule,
  EventBusService,
  ActivatedRouteStub,
} from '@epgu/epgu-constructor-ui-kit';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { ValidationServiceStub } from '../../../../shared/services/validation/validation.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ValidationTypeModule } from '../../../../shared/directives/validation-type/validation-type.module';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { SuggestMonitorService } from '../../../../shared/services/suggest-monitor/suggest-monitor.service';
import { HttpClientModule } from '@angular/common/http';

const mockComponent = {
  id: 'pd6',
  type: 'ConfirmPersonalPolicyChange',
  label: '',
  attrs: {
    fields: [],
  },
  value: {
    number: null,
    series: null,
  },
  visited: false,
  required: false,
};

describe('ConfirmPersonalPolicyChangeComponent', () => {
  let formService: ComponentsListFormService;
  let component: ConfirmPersonalPolicyChangeComponent;
  let fixture: ComponentFixture<ConfirmPersonalPolicyChangeComponent>;
  let control: FormGroup;
  let valueControl: FormControl;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmPersonalPolicyChangeComponent],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ValidationService, useClass: ValidationServiceStub },
        MockProvider(SuggestHandlerService),
        MockProvider(CurrentAnswersService),
        MockProvider(ConfigService),
        MockProvider(LoggerService),
        MockProvider(EventBusService),
        MockProvider(SuggestMonitorService),
        FormBuilder,
      ],
      imports: [
        MockModule(ValidationTypeModule),
        MockModule(BaseComponentsModule),
        MockModule(ConstructorPlainInputModule),
        MockModule(ErrorModule),
        MockModule(BaseModule),
        MockModule(InputErrorModule),
        HttpClientModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    formService = TestBed.inject(ComponentsListFormService);
    fixture = TestBed.createComponent(ConfirmPersonalPolicyChangeComponent);
    component = fixture.componentInstance;
    component.componentIndex = 0;
    mockComponent.attrs.fields = [
      {
        attrs: {
          validation: [
            {
              condition: '',
              dataType: '',
              errorMsg: 'Номер должен быть не длиннее 20 знаков и может содержать только цифры',
              ref: '',
              type: 'RegExp',
              updateOn: 'blur',
              value: '^[0-9]{0,20}$',
            }
          ]
        },
        fieldName: 'number',
        label: 'Номер полиса',
        type: 'input',
      },
      {
        fieldName: 'series',
        hint: 'Для полисов старого образца',
        label: 'Серия полиса',
        type: 'input',
      }
    ];

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
    it('should set fields from component attrs', () => {
      component.ngOnInit();

      expect(component.fields).toEqual(mockComponent.attrs.fields);
    });

    it('should create the form', () => {
      jest.spyOn<any, any>(component, 'addFormGroupControls');

      component.ngOnInit();

      expect(component['addFormGroupControls']).toHaveBeenCalled();
      expect(component.form).toBeDefined();
    });

    it('should subscribe on form valueChanges', () => {
      const formValueMock = {
        number: '123321',
        series: '8000',
      };

      const expectedValue = {
        number: '123321',
        series: '8000',
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

  describe('Form value changes', () => {
    it('should set value to control if form is VALID', () => {
      const formValueMock = {
        number: '123321',
        series: '8000',
      };

      const expectedValue = {
        number: '123321',
        series: '8000',
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
        number: '123321df',
        series: '89775',
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
});
