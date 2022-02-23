import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { DateInputComponent } from './date-input.component';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { ConstructorDatePickerComponent } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.component';
import { BaseModule } from '../../../../shared/base.module';
import { MockComponents, MockProvider } from 'ng-mocks';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { mockComponent } from './date-input.mock';

describe('DateInputComponent', () => {
  let component: DateInputComponent;
  let fixture: ComponentFixture<DateInputComponent>;
  let formService: ComponentsListFormService;
  let control: FormGroup;
  let fb: FormBuilder;
  let dateRangeService: DateRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BaseModule],
      declarations: [
        DateInputComponent,
        MockComponents(ComponentItemComponent, ConstructorDatePickerComponent),
      ],
      providers: [
        MockProvider(DateRangeService),
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fb = TestBed.inject(FormBuilder);
    dateRangeService = TestBed.inject(DateRangeService);
    formService = (TestBed.inject(
      ComponentsListFormService,
    ) as unknown) as ComponentsListFormService;
    control = fb.group(mockComponent);
    formService['_form'] = new FormArray([control]);
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
