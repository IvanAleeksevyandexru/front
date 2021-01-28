import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule, RadioComponent } from 'epgu-lib';
import { MockComponent, MockModule } from 'ng-mocks';
import { ChangeDetectionStrategy } from '@angular/core';

import { EmployeeHistoryFormComponent } from './employee-history-form.component';
import { ConstructorPlainInputModule } from '../../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMonthPickerModule } from '../../../../../../shared/components/constructor-month-picker/constructor-month-picker.module';
import { ConstructorCheckboxModule } from '../../../../../../shared/components/constructor-checkbox/constructor-checkbox.module';
import { EmployeeHistoryFormService } from '../../services/employee-history.form.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { EmployeeHistoryMonthsService } from '../../services/employee-history.months.service';
import { EmployeeHistoryDataSourceService } from '../../services/employee-history.data-source.service';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { EmployeeHistoryDescriptionComponent } from '../employee-history-desription/employee-history-description.component';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { CloneButtonModule } from '../../../../../../shared/components/clone-button/clone-button.module';
import { MemoModule } from '../../../../../../shared/pipes/memo/memo.module';

describe('EmployeeHistoryFormComponent', () => {
  let component: EmployeeHistoryFormComponent;
  let fixture: ComponentFixture<EmployeeHistoryFormComponent>;
  let employeeHistoryFormService: EmployeeHistoryFormService;
  let employeeHistoryDataSourceService: EmployeeHistoryDataSourceService;
  let employeeHistoryMonthsService: EmployeeHistoryMonthsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeeHistoryFormComponent,
        MockComponent(EmployeeHistoryDescriptionComponent),
        // MockComponent(RadioComponent),
      ],
      imports: [
        ReactiveFormsModule,
        MockModule(ConstructorPlainInputModule),
        MockModule(ConstructorMonthPickerModule),
        MockModule(ConstructorCheckboxModule),
        MockModule(BaseComponentsModule),
        MockModule(CloneButtonModule),
        MockModule(MemoModule),
      ],
      providers: [
        EmployeeHistoryFormService,
        UnsubscribeService,
        EmployeeHistoryDataSourceService,
        EmployeeHistoryMonthsService,
        EventBusService,
      ],
    })
      .overrideComponent(EmployeeHistoryFormComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeHistoryFormComponent);
    employeeHistoryFormService = fixture.debugElement.injector.get(EmployeeHistoryFormService);
    employeeHistoryDataSourceService = fixture.debugElement.injector.get(
      EmployeeHistoryDataSourceService,
    );
    employeeHistoryMonthsService = fixture.debugElement.injector.get(EmployeeHistoryMonthsService);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('nothing', () => {
    expect(true).toBeTruthy();
  });
});
