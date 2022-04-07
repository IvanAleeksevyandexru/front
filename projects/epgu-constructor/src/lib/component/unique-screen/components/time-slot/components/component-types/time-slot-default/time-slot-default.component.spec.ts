import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { TimeSlotSmev3Component } from '../../base/time-slot-smev3/time-slot-smev3.component';
import { TimeSlotSmev3Service } from '../../../services/smev3/time-slot-smev3.service';
import { TimeSlotSmev3ServiceStub } from '../../../services/smev3/time-slot-smev3.service.stub';
import { TimeSlotSmev3StateService } from '../../../services/smev3-state/time-slot-smev3-state.service';
import { TimeSlotSmev3StateServiceStub } from '../../../services/smev3-state/time-slot-smev3-state.service.stub';
import { TimeSlotStateService } from '../../../services/state/time-slot-state.service';
import { TimeSlotStateServiceStub } from '../../../services/state/time-slot-state.service.stub';
import { TimeSlotValueInterface } from '../../../typings';
import { TimeSlotErrorComponent } from '../../base/time-slot-error/time-slot-error.component';
import { TimeSlotDefaultComponent } from './time-slot-default.component';
import { of } from 'rxjs';

describe('TimeSlotDefaultComponent', () => {
  const testValue = ({
    routeNumber: 'test',
    subject: 'subject',
    calendarName: 'calendarName',
    serviceCode: 'serviceCode',
    preliminaryReservation: 'preliminaryReservation',
    preliminaryReservationPeriod: 'preliminaryReservationPeriod',
  } as unknown) as TimeSlotValueInterface;

  let component: TimeSlotDefaultComponent;
  let fixture: ComponentFixture<TimeSlotDefaultComponent>;
  let smev3Service: TimeSlotSmev3Service;
  let smev3StateService: TimeSlotSmev3StateService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimeSlotDefaultComponent,
        MockComponent(TimeSlotSmev3Component),
        MockComponent(TimeSlotErrorComponent),
      ],
      imports: [],
      providers: [
        { provide: TimeSlotSmev3Service, useClass: TimeSlotSmev3ServiceStub },
        { provide: TimeSlotSmev3StateService, useClass: TimeSlotSmev3StateServiceStub },
        { provide: TimeSlotStateService, useClass: TimeSlotStateServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    smev3Service = TestBed.inject(TimeSlotSmev3Service);
    smev3StateService = TestBed.inject(TimeSlotSmev3StateService);

    smev3StateService.value$ = of(testValue);

    fixture = TestBed.createComponent(TimeSlotDefaultComponent);

    component = fixture.componentInstance;
  });

  describe('base', () => {
    it('should be getPartialListRequestParams', (done) => {
      jest.spyOn(component, 'getPartialListRequestParams');
      component.requestListParams$.subscribe((value) => {
        expect(component.getPartialListRequestParams).toHaveBeenCalledWith(testValue);
        expect(value).toEqual({
          routeNumber: testValue.routeNumber,
        });
        done();
      });
    });
    it('should be getPartialBookRequestParams', (done) => {
      jest.spyOn(component, 'getPartialBookRequestParams');
      component.requestBookParams$.subscribe((value) => {
        expect(component.getPartialBookRequestParams).toHaveBeenCalledWith(testValue);
        expect(value).toEqual(testValue);
        done();
      });
    });
  });
});
