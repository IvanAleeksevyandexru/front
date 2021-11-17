import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSlotMvdComponent } from './time-slot-mvd.component';
import { MockComponent } from 'ng-mocks';
import { TimeSlotSmev3Component } from '../../base/time-slot-smev3/time-slot-smev3.component';
import { TimeSlotSmev3StateService } from '../../../services/smev3-state/time-slot-smev3-state.service';
import { TimeSlotSmev3StateServiceStub } from '../../../services/smev3-state/time-slot-smev3-state.service.stub';
import { DepartmentInterface, TimeSlotValueInterface } from '../../../typings';

describe('TimeSlotMvdComponent', () => {
  let component: TimeSlotMvdComponent;
  let fixture: ComponentFixture<TimeSlotMvdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSlotMvdComponent, MockComponent(TimeSlotSmev3Component)],
      imports: [],
      providers: [{ provide: TimeSlotSmev3StateService, useClass: TimeSlotSmev3StateServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSlotMvdComponent);
    component = fixture.componentInstance;
  });

  describe('base', () => {
    it('should be getPartialListRequestParams', () => {
      expect(
        component.getPartialListRequestParams(
          ({ organizationId: 'test', parentOrderId: 'test2' } as unknown) as TimeSlotValueInterface,
          ({} as unknown) as DepartmentInterface,
        ),
      ).toEqual({
        organizationId: 'test',
        caseNumber: 'test2',
      });
      expect(
        component.getPartialListRequestParams(
          ({ organizationId: null, parentOrderId: 'test2' } as unknown) as TimeSlotValueInterface,
          ({ value: 'test4' } as unknown) as DepartmentInterface,
        ),
      ).toEqual({
        organizationId: 'test4',
        caseNumber: 'test2',
      });
    });
    it('should be getPartialBookRequestParams', () => {
      expect(
        component.getPartialBookRequestParams(({
          parentOrderId: 'test1',
          orderId: 'test2',
        } as unknown) as TimeSlotValueInterface),
      ).toEqual({ caseNumber: 'test2', parentOrderId: 'test1' });
    });
  });
});
