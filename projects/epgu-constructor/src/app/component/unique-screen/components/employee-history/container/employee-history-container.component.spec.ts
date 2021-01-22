import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';
import { of } from 'rxjs';

import { EmployeeHistoryContainerComponent } from './employee-history-container.component';
import { DisplayDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { EmployeeHistoryDescriptionComponent } from '../components/employee-history-desription/employee-history-description.component';
import { EmployeeHistoryFormComponent } from '../components/employee-history-form/employee-history-form.component';
import { BaseComponentsModule } from '../../../../../shared/components/base-components/base-components.module';
import { EventBusService } from '../../../../../core/services/event-bus/event-bus.service';

describe('EmployeeHistoryComponent', () => {
  let component: EmployeeHistoryContainerComponent;
  let fixture: ComponentFixture<EmployeeHistoryContainerComponent>;
  let mockDisplay: DisplayDto = {};
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        EpguLibModule,
        ConstructorPlainInputModule,
        ConstructorMonthPickerModule,
        ConstructorCheckboxModule,
        BaseComponentsModule,
      ],

      declarations: [
        EmployeeHistoryContainerComponent,
        EmployeeHistoryDescriptionComponent,
        EmployeeHistoryFormComponent,
      ],
      providers: [EventBusService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeHistoryContainerComponent);
    component = fixture.componentInstance;
    component.display$ = of(mockDisplay);
    component.header$ = of('');
    component.gender$ = of(Gender.male);
    fixture.detectChanges();
  });

  it('nothing', () => {
    expect(true).toBeTruthy();
  });
});
