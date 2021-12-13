import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import {
  ConfigService,
  ConfigServiceStub,
  ModalService,
  ModalServiceStub,
  JsonHelperService,
} from '@epgu/epgu-constructor-ui-kit';
import { TimeSlotVaccinationComponent } from './time-slot-vaccination.component';
import { TimeSlotSmev3Component } from '../../base/time-slot-smev3/time-slot-smev3.component';
import { TimeSlotSmev3Service } from '../../../services/smev3/time-slot-smev3.service';
import { TimeSlotSmev3ServiceStub } from '../../../services/smev3/time-slot-smev3.service.stub';
import { TimeSlotSmev3StateService } from '../../../services/smev3-state/time-slot-smev3-state.service';
import { TimeSlotErrorService } from '../../../services/error/time-slot-error.service';
import { TimeSlotsConstants } from '../../../../time-slots/time-slots.constants';
import { ScreenService } from '../../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../../screen/screen.service.stub';
import { TimeSlotValueInterface } from '../../../typings';
import { doctorHandlers } from '../../../handlers/doctor-handlers';
import { TimeSlotErrorComponent } from '../../base/time-slot-error/time-slot-error.component';

describe('TimeSlotVaccinationComponent', () => {
  let component: TimeSlotVaccinationComponent;
  let fixture: ComponentFixture<TimeSlotVaccinationComponent>;
  let errorService: TimeSlotErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimeSlotVaccinationComponent,
        MockComponent(TimeSlotErrorComponent),
        MockComponent(TimeSlotSmev3Component),
      ],
      imports: [],
      providers: [
        { provide: TimeSlotSmev3Service, useClass: TimeSlotSmev3ServiceStub },
        TimeSlotSmev3StateService,
        TimeSlotErrorService,
        { provide: ModalService, useClass: ModalServiceStub },
        TimeSlotsConstants,
        { provide: ConfigService, useClass: ConfigServiceStub },
        JsonHelperService,
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    errorService = TestBed.inject(TimeSlotErrorService);
    fixture = TestBed.createComponent(TimeSlotVaccinationComponent);
    component = fixture.componentInstance;
  });

  describe('test', () => {
    it('should be getPartialBookRequestParams', () => {
      expect(
        component.getPartialBookRequestParams(({
          parentOrderId: 'test1',
          orderId: 'test2',
        } as unknown) as TimeSlotValueInterface),
      ).toEqual({ caseNumber: 'test2', parentOrderId: 'test1' });
    });
    it('should be ngOnInit addHandlers', () => {
      jest.spyOn(errorService, 'addHandlers');
      fixture.detectChanges();
      expect(errorService.addHandlers).toHaveBeenCalledWith(doctorHandlers);
    });
  });
});
