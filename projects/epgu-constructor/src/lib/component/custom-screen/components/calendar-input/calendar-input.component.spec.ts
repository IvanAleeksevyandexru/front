import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MockModule, MockProviders } from 'ng-mocks';
import { BaseUiModule, EventBusService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { CalendarInputComponent } from './calendar-input.component';
import { OutputHtmlComponent } from '../../../../shared/components/output-html/output-html.component';
import { LabelComponent } from '../../../../shared/components/base-components/label/label.component';
import { HintComponent } from '../../../../shared/components/base-components/hint/hint.component';
import { ConstructorDatePickerComponent } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.component';
import { ClickableLabelDirective } from '../../../../shared/directives/clickable-label/clickable-label.directive';
import { TableDirective } from '../../../../shared/directives/table/table.directive';
import { ValidationTypeDirective } from '../../../../shared/directives/validation-type/validation-type.directive';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { ComponentsListToolsService } from '../../services/components-list-tools/components-list-tools.service';
import { TypeCastService } from '../../../../core/services/type-cast/type-cast.service';

describe('CalendarInputComponent', () => {
  let mockComponent;
  let component: CalendarInputComponent;
  let fixture: ComponentFixture<CalendarInputComponent>;

  let formService: ComponentsListFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CalendarInputComponent,
        OutputHtmlComponent,
        LabelComponent,
        HintComponent,
        ConstructorDatePickerComponent,
        ClickableLabelDirective,
        TableDirective,
        ValidationTypeDirective,
      ],
      imports: [MockModule(BaseUiModule)],
      providers: [
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        MockProviders(ValidationService, EventBusService, TypeCastService),
        UnsubscribeService,
        ComponentsListToolsService,
        FormBuilder,
      ],
    }).compileComponents();
  });
  let control: FormGroup;

  beforeEach(() => {
    mockComponent = {
      id: 'SomeId',
      type: 'CalendarInput',
      attrs: {
        components: [
          { id: 'firstDate', attrs: {}},
          { id: 'secondDate', attrs: {}},
        ],
        dateRestrictions: {
          type: 'const',
          condition: '>',
          value: '21.02.2001',
        },
      },
      value:
        '{"firstDate" : "1979-07-05T00:00:00.000+05:00", "secondDate": "1979-07-05T00:00:00.000+05:00"}',
      required: false,
    };

    formService = TestBed.inject(ComponentsListFormService);

    control = new FormGroup({
      id: new FormControl(mockComponent.id),
      attrs: new FormControl(mockComponent.attrs),
      value: new FormControl(mockComponent.value),
      required: new FormControl(mockComponent.required),
      type: new FormControl(mockComponent.type),
    });
    formService['_form'] = new FormArray([control]);
    fixture = TestBed.createComponent(CalendarInputComponent);
    component = fixture.componentInstance;
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  it('should emit change in form service on value change', () => {
    const spy = jest.spyOn(component, 'emitToParentForm');

    component.form.patchValue({ firstDate: '', secondDate: new Date() });

    expect(spy).toHaveBeenCalled();
  });

  describe('initFormGroup()', () => {
    it('should fill form value according to JSON parsed', () => {
      component.ngOnInit();

      expect(component.form.get('firstDate').value).toEqual(
        new Date('1979-07-05T00:00:00.000+05:00'),
      );
      expect(component.form.get('secondDate').value).toEqual(
        new Date('1979-07-05T00:00:00.000+05:00'),
      );
    });
  });

  describe('processErrors()', () => {
    it('should set errors to form from control', () => {
      component.ngOnInit();
      component.control.get('value').setErrors({ test: 'test', forChild: 'firstDate' });

      component.processErrors();

      expect(component.form.get('firstDate').getError('test')).toBe('test');
    });
  });
});
