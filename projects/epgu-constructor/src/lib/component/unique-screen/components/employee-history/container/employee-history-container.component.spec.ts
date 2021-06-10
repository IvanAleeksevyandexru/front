import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

import { EmployeeHistoryContainerComponent } from './employee-history-container.component';
import { EmployeeHistoryDescriptionComponent } from '../components/employee-history-desription/employee-history-description.component';
import { EmployeeHistoryFormComponent } from '../components/employee-history-form/employee-history-form.component';
import { BaseComponentsModule } from '../../../../../shared/components/base-components/base-components.module';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { EmployeeHistoryDataSourceService } from '../services/employee-history.data-source.service';
import { BaseModule } from '../../../../../shared/base.module';
import { EmployeeHistoryFormData } from '../employee-history.types';
import { DefaultUniqueScreenWrapperModule } from '../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { configureTestSuite } from 'ng-bullet';
import { Gender } from '@epgu/epgu-constructor-types';

describe('EmployeeHistoryContainerComponent', () => {
  let component: EmployeeHistoryContainerComponent;
  let fixture: ComponentFixture<EmployeeHistoryContainerComponent>;
  let employeeHistoryDataSourceService: EmployeeHistoryDataSourceService;
  let screenService: ScreenService;
  let eventBusService: EventBusService;
  const mockComponent = {
    id: 'eh1',
    type: 'EmployeeHistory',
    label: '',
    attrs: { years: 10, nonStop: true },
    linkedValues: [],
    arguments: {},
    value: '',
    required: true,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeeHistoryContainerComponent,
        MockComponent(EmployeeHistoryDescriptionComponent),
        MockComponent(EmployeeHistoryFormComponent),
      ],
      imports: [
        MockModule(BaseComponentsModule),
        MockModule(BaseModule),
        MockModule(DefaultUniqueScreenWrapperModule),
      ],
      providers: [
        EventBusService,
        EmployeeHistoryDataSourceService,
        CurrentAnswersService,
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    })
      .overrideComponent(EmployeeHistoryFormComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeHistoryContainerComponent);
    component = fixture.componentInstance;
    employeeHistoryDataSourceService = TestBed.inject(EmployeeHistoryDataSourceService);
    screenService = TestBed.inject(ScreenService);
    eventBusService = TestBed.inject(EventBusService);
    screenService.header = 'Header';
    screenService.gender = Gender.female;
    screenService.component = mockComponent;
    fixture.detectChanges();
  });

  it('should be update employeeHistoryData and isValid', () => {
    const mockData: EmployeeHistoryFormData = {
      isValid: true,
      data: [],
    };
    const debugEl = fixture.debugElement.query(By.css('epgu-constructor-employee-history-form'));
    debugEl.triggerEventHandler('updateFormEvent', mockData);

    expect(component.currentAnswersService.isValid).toBe(mockData.isValid);
    expect(component.currentAnswersService.state).toEqual(JSON.stringify(mockData.data));
  });

  describe('init$', () => {
    it('should be create ds', () => {
      component.init$.subscribe((value) => {
        expect(component.ds.length).toBeGreaterThan(0);
      });
    });
  });
});
