import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { DictionaryConditions } from '@epgu/epgu-constructor-types';
import { TimeSlotsApiItem } from '@epgu/epgu-constructor-ui-kit';
import { TimeSlotDivorceComponent } from './time-slot-divorce.component';
import { TimeSlotSmev3Component } from '../../base/time-slot-smev3/time-slot-smev3.component';
import { TimeSlotAreaComponent } from '../../base/time-slot-area/time-slot-area.component';
import { TimeSlotSmev3Service } from '../../../services/smev3/time-slot-smev3.service';
import { TimeSlotSmev3ServiceStub } from '../../../services/smev3/time-slot-smev3.service.stub';
import { TimeSlotSmev3StateService } from '../../../services/smev3-state/time-slot-smev3-state.service';
import { TimeSlotSmev3StateServiceStub } from '../../../services/smev3-state/time-slot-smev3-state.service.stub';
import { TimeSlotStateService } from '../../../services/state/time-slot-state.service';
import { TimeSlotStateServiceStub } from '../../../services/state/time-slot-state.service.stub';
import { DepartmentInterface, TimeSlotValueInterface } from '../../../typings';
import { TimeSlotErrorComponent } from '../../base/time-slot-error/time-slot-error.component';

describe('TimeSlotDivorceComponent', () => {
  let component: TimeSlotDivorceComponent;
  let fixture: ComponentFixture<TimeSlotDivorceComponent>;
  let smev3Service: TimeSlotSmev3Service;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimeSlotDivorceComponent,
        MockComponent(TimeSlotSmev3Component),
        MockComponent(TimeSlotErrorComponent),
        MockComponent(TimeSlotAreaComponent),
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

    fixture = TestBed.createComponent(TimeSlotDivorceComponent);
    component = fixture.componentInstance;
  });

  describe('base', () => {
    it('should be createAreaAttributes', () => {
      expect(component.createAreaAttributes()).toEqual([
        {
          simple: {
            attributeName: 'PR3',
            condition: DictionaryConditions.CONTAINS,
            value: { asString: 'true' },
          },
        },
      ]);
    });
    it('should be getPartialListRequestParams', () => {
      let attributeValues = {};
      expect(
        component.getPartialListRequestParams(
          ({ organizationId: 'test' } as unknown) as TimeSlotValueInterface,
          ({ attributeValues } as unknown) as DepartmentInterface,
        ),
      ).toEqual({
        organizationId: ['test'],
      });
      attributeValues = { CODE: 'test2' };
      expect(
        component.getPartialListRequestParams(
          ({} as unknown) as TimeSlotValueInterface,
          ({ attributeValues } as unknown) as DepartmentInterface,
        ),
      ).toEqual({
        organizationId: ['test2'],
      });
    });
    it('should be getPartialBookRequestParams', () => {
      const attributeValues = { CODE: '1' };
      expect(
        component.getPartialBookRequestParams(
          ({ attributeValues } as unknown) as DepartmentInterface,
          ({ serviceId: 'test' } as unknown) as TimeSlotValueInterface,
          ({} as unknown) as TimeSlotsApiItem,
        ),
      ).toEqual({
        organizationId: '1',
        attributes: [{ name: 'serviceId', value: 'test' }],
      });

      const empty = {};
      expect(
        component.getPartialBookRequestParams(
          ({ attributeValues: empty } as unknown) as DepartmentInterface,
          ({} as unknown) as TimeSlotValueInterface,
          ({ serviceId: 'test2' } as unknown) as TimeSlotsApiItem,
        ),
      ).toEqual({
        attributes: [{ name: 'serviceId', value: 'test2' }],
      });
    });
  });
});
