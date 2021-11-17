import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSlotMarriageComponent } from './time-slot-marriage.component';
import { MockComponent } from 'ng-mocks';
import { TimeSlotSmev3Component } from '../../base/time-slot-smev3/time-slot-smev3.component';
import { TimeSlotAreaComponent } from '../../base/time-slot-area/time-slot-area.component';
import { TimeSlotSmev3Service } from '../../../services/smev3/time-slot-smev3.service';
import { TimeSlotSmev3ServiceStub } from '../../../services/smev3/time-slot-smev3.service.stub';
import { TimeSlotSmev3StateService } from '../../../services/smev3-state/time-slot-smev3-state.service';
import { TimeSlotSmev3StateServiceStub } from '../../../services/smev3-state/time-slot-smev3-state.service.stub';
import { TimeSlotStateService } from '../../../services/state/time-slot-state.service';
import { TimeSlotStateServiceStub } from '../../../services/state/time-slot-state.service.stub';
import { of } from 'rxjs';
import { DictionaryConditions } from '@epgu/epgu-constructor-types';
import { DepartmentInterface, TimeSlotValueInterface } from '../../../typings';
import { TimeSlotsApiItem } from '@epgu/epgu-constructor-ui-kit';

describe('TimeSlotMarriageComponent', () => {
  let component: TimeSlotMarriageComponent;
  let fixture: ComponentFixture<TimeSlotMarriageComponent>;
  let smev3StateService: TimeSlotSmev3StateService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimeSlotMarriageComponent,
        MockComponent(TimeSlotSmev3Component),
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
    smev3StateService = TestBed.inject(TimeSlotSmev3StateService);
    smev3StateService.slotsPeriod$ = of('2018-10');
    fixture = TestBed.createComponent(TimeSlotMarriageComponent);
    component = fixture.componentInstance;
  });

  describe('base', () => {
    it('should be createAreaAttributes', () => {
      expect(component.createAreaAttributes(true)).toEqual([
        {
          simple: {
            attributeName: 'PR2',
            condition: DictionaryConditions.CONTAINS,
            value: { asString: 'true' },
          },
        },
        {
          simple: {
            attributeName: 'SOLEMN',
            condition: DictionaryConditions.EQUALS,
            value: { asString: 'true' },
          },
        },
      ]);
    });
    it('should be getPartialListRequestParams', () => {
      let attributeValues = { code: 'test3' };
      expect(
        component.getPartialListRequestParams(
          ({ organizationId: 'test' } as unknown) as TimeSlotValueInterface,
          ({ attributeValues } as unknown) as DepartmentInterface,
          '2012-12',
          true,
        ),
      ).toEqual({
        attributes: [
          { name: 'SolemnRegistration', value: true },
          { name: 'SlotsPeriod', value: '2012-12' },
        ],
        organizationId: 'test',
      });
    });
  });
});
