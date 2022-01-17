import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { DateInputComponent } from './date-input.component';
import { ForTestsOnlyModule } from '../../../../core/for-tests-only.module';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { ConstructorDatePickerComponent } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.component';
import { BaseModule } from '../../../../shared/base.module';
import { MockComponents } from 'ng-mocks';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { DictionaryService } from '../../../../shared/services/dictionary/dictionary.service';
import { DictionaryServiceStub } from '../../../../shared/services/dictionary/dictionary.service.stub';

const mockComponent = {
  id: 'cl11_4',
  name: '<b>Дата рождения</b>',
  type: 'DateInput',
  createOrder: false,
  checkForDuplicate: false,
  clearCacheForComponentIds: [],
  label: '<b>Дата рождения</b>',
  skipValidation: false,
  attrs: {
    fields: [
      {
        fieldName: 'birthDate',
      },
    ],
    accuracy: 'day',
    minDate: '-7y11m29d',
    maxDate: 'today',
    validation: [
      {
        type: 'RegExp',
        value: '.*',
        ref: '',
        condition: '',
        errorMsg: 'Поле должно быть заполнено',
      },
      {
        type: 'Date',
        value: '',
        ref: '',
        condition: '<',
        errorMsg: 'Возраст ребёнка не должен превышать 7 лет',
      },
      {
        type: 'Date',
        value: '',
        ref: '',
        condition: '>',
        errorMsg: 'Дата рождения ребёнка не должна быть больше текущей даты',
      },
    ],
  },
  linkedValues: [
    {
      version: 1,
      argument: 'minDate',
      jsonLogic: {
        value: 'variable.today',
        type: 'DateToString',
        accuracy: '',
        add: {
          year: -8,
          day: 1,
        },
      },
      converterSettings: {
        converter: 'DATE',
        format: 'dd.MM.yyyy',
        path: '',
      },
      jsonSource: false,
    },
  ],
  arguments: {
    minDate: '22.12.2013',
  },
  value: '',
  required: true,
  sendAnalytics: false,
};

describe('DateInputComponent', () => {
  let component: DateInputComponent;
  let fixture: ComponentFixture<DateInputComponent>;
  let formService: ComponentsListFormServiceStub;
  let control: FormGroup;
  let fb: FormBuilder;
  let dateRangeService: DateRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ForTestsOnlyModule, BaseModule],
      declarations: [
        DateInputComponent,
        MockComponents(ComponentItemComponent, ConstructorDatePickerComponent),
      ],
      providers: [{ provide: DictionaryService, useClass: DictionaryServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fb = TestBed.inject(FormBuilder);
    dateRangeService = TestBed.inject(DateRangeService);
    formService = (TestBed.inject(
      ComponentsListFormService,
    ) as unknown) as ComponentsListFormServiceStub;
    control = fb.group(mockComponent);
    formService._form = new FormArray([control]);
    fixture = TestBed.createComponent(DateInputComponent);
    component = fixture.componentInstance;
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  it('clearDate should call dateRangeService.clearDate', () => {
    jest.spyOn(dateRangeService, 'clearDate');
    component.clearDate(null, null);
    expect(dateRangeService.clearDate).toHaveBeenCalled();
  });
});
