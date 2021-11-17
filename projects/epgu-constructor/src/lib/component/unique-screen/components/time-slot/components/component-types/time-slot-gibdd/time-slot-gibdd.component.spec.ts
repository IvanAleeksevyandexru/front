import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSlotGibddComponent } from './time-slot-gibdd.component';
import { MockComponent } from 'ng-mocks';
import { TimeSlotSmev3Component } from '../../base/time-slot-smev3/time-slot-smev3.component';
import { TimeSlotSmev3StateService } from '../../../services/smev3-state/time-slot-smev3-state.service';
import { TimeSlotSmev3StateServiceStub } from '../../../services/smev3-state/time-slot-smev3-state.service.stub';
import { DepartmentInterface, TimeSlotValueInterface } from '../../../typings';
import { TimeSlotsApiItem } from '@epgu/epgu-constructor-ui-kit';

describe('TimeSlotGibddComponent', () => {
  let component: TimeSlotGibddComponent;
  let fixture: ComponentFixture<TimeSlotGibddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSlotGibddComponent, MockComponent(TimeSlotSmev3Component)],
      imports: [],
      providers: [{ provide: TimeSlotSmev3StateService, useClass: TimeSlotSmev3StateServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSlotGibddComponent);
    component = fixture.componentInstance;
  });

  describe('base', () => {
    it('should be getPartialListRequestParams', () => {
      let attributeValues = { code: 'test3' };
      expect(
        component.getPartialListRequestParams(
          ({ organizationId: 'test', serviceId: 'test2' } as unknown) as TimeSlotValueInterface,
          ({ attributeValues } as unknown) as DepartmentInterface,
          { serviceId: 'test4' } as TimeSlotsApiItem,
        ),
      ).toEqual({
        organizationId: 'test',
        attributes: [
          { name: 'organizationId', value: 'test3' },
          { name: 'serviceId', value: 'test2' },
        ],
      });

      expect(
        component.getPartialListRequestParams(
          ({ organizationId: null, serviceId: 'test2' } as unknown) as TimeSlotValueInterface,
          ({ attributeValues } as unknown) as DepartmentInterface,
          { serviceId: 'test4' } as TimeSlotsApiItem,
        ),
      ).toEqual({
        organizationId: 'test3',
        attributes: [
          { name: 'organizationId', value: 'test3' },
          { name: 'serviceId', value: 'test2' },
        ],
      });

      expect(
        component.getPartialListRequestParams(
          ({ organizationId: null, serviceId: null } as unknown) as TimeSlotValueInterface,
          ({ attributeValues } as unknown) as DepartmentInterface,
          { serviceId: 'test4' } as TimeSlotsApiItem,
        ),
      ).toEqual({
        organizationId: 'test3',
        attributes: [
          { name: 'organizationId', value: 'test3' },
          { name: 'serviceId', value: 'test4' },
        ],
      });
    });

    it('should be getPartialBookRequestParams', () => {
      expect(
        component.getPartialBookRequestParams(
          ({ serviceId: 'test' } as unknown) as TimeSlotValueInterface,
          ({} as unknown) as TimeSlotsApiItem,
        ),
      ).toEqual({
        attributes: [{ name: 'serviceId', value: 'test' }],
      });

      expect(
        component.getPartialBookRequestParams(
          ({} as unknown) as TimeSlotValueInterface,
          ({ serviceId: 'test2' } as unknown) as TimeSlotsApiItem,
        ),
      ).toEqual({
        attributes: [{ name: 'serviceId', value: 'test2' }],
      });
    });
  });
});
