import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MonthYear } from 'epgu-lib';

import { EmployeeHistoryContainerComponent } from './employee-history-container.component';
import { EmployeeHistoryDescriptionComponent } from '../components/employee-history-desription/employee-history-description.component';
import { EmployeeHistoryFormComponent } from '../components/employee-history-form/employee-history-form.component';
import { BaseComponentsModule } from '../../../../../shared/components/base-components/base-components.module';
import { EventBusService } from '../../../../../core/services/event-bus/event-bus.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { EmployeeHistoryDataSourceService } from '../services/employee-history.data-source.service';
import { BaseModule } from '../../../../../shared/base.module';
import { ScreenContainerModule } from '../../../../../shared/components/screen-container/screen-container.module';
import { Gender } from '../../../../../shared/types/gender';
import { EmployeeHistoryFormData, EmployeeHistoryModel } from '../employee-history.types';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeeHistoryContainerComponent,
        MockComponent(EmployeeHistoryDescriptionComponent),
        MockComponent(EmployeeHistoryFormComponent),
      ],
      imports: [
        MockModule(BaseComponentsModule),
        MockModule(BaseModule),
        MockModule(ScreenContainerModule),
      ],
      providers: [
        EventBusService,
        EmployeeHistoryDataSourceService,
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

  it('nothing', () => {
    expect(true).toBeTruthy();
  });

  it('should be update employeeHistoryData and isValid', () => {
    const mockData: EmployeeHistoryFormData = {
      isValid: true,
      data: [],
    };
    const debugEl = fixture.debugElement.query(By.css('epgu-constructor-employee-history-form'));
    debugEl.triggerEventHandler('updateFormEvent', mockData);

    expect(component.isValid).toBe(mockData.isValid);
    expect(component.employeeHistoryData).toEqual(mockData.data);
  });

  describe('init$', () => {
    it('should be create ds', () => {
      component.init$.subscribe((value) => {
        expect(component.ds.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getNextScreen', () => {
    it('should be call eventBusService with data', () => {
      jest.spyOn(eventBusService, 'emit');
      const employeeHistoryDataMock: EmployeeHistoryModel[] = [
        {
          address: '',
          from: new MonthYear(1, 2021),
          to: new MonthYear(1, 2021),
          place: '',
          position: '',
          type: 'employed',
          label: 'Я работала',
        },
      ];
      component.employeeHistoryData = employeeHistoryDataMock;
      component.getNextScreen();

      const expectData = [
        {
          address: '',
          place: '',
          position: '',
          type: 'employed',
          label: 'Я работала',
          to: {
            year: 2021,
            month: 1,
            monthCode: 'Февраль',
          },
          from: {
            year: 2021,
            month: 1,
            monthCode: 'Февраль',
          },
        },
      ];
      expect(eventBusService.emit).toBeCalledWith('nextStepEvent', JSON.stringify(expectData));
    });
  });
});
