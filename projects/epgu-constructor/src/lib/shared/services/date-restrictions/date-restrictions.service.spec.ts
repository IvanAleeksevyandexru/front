import { configureTestSuite } from 'ng-bullet';
import { TestBed } from '@angular/core/testing';
import { DateRestrictionsService } from './date-restrictions.service';
import { ConfigService, DatesToolsService, LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { FormArray, FormControl } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DateRefService } from '../../../core/services/date-ref/date-ref.service';
import { CustomScreenComponentTypes, DateRestriction } from '../../../component/custom-screen/components-list.types';

describe('DateRestrictionsService', () => {
  let service: DateRestrictionsService;
  let datesToolsService: DatesToolsService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        DateRestrictionsService,
        DatesToolsService,
        ConfigService,
        LoggerService,
        DateRefService,
      ],
      imports: [HttpClientTestingModule],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DateRestrictionsService);
    datesToolsService = TestBed.inject(DatesToolsService);

    jest
      .spyOn(datesToolsService, 'getToday')
      .mockResolvedValue(new Date('2021-01-01T00:00:00.000Z'));
  });

  describe('getDateRange() method', () => {
    it('should calculate range', async () => {
      const range = await service.getDateRange(
        'compId',
        [
          {
            condition: '>',
            type: 'const',
            value: 'today',
          },
        ],
        [],
        new FormArray([]),
        {},
      );

      expect(range).toEqual({
        min: new Date('2021-01-02T00:00:00.000Z'),
        max: null,
      });
    });

  });

  describe('setDateRefs() method', () => {

    it('should correctly set refs for current screen components', () => {
      const restrictions: DateRestriction[] = [
          {
            condition: '>',
            type: 'ref',
            value: 'test',
          },
        ];
      service.setDateRefs(
        restrictions,
        [{ id: 'test', value: '', attrs: {}, type: CustomScreenComponentTypes.DateInput }],
        new FormArray([new FormControl({ value: '24.04.2001', id: 'test' })]),
        {},
      );
      expect(restrictions[0].value).toEqual('24.04.2001');
    });

    it('should correctly set refs for current screen compound components', () => {
      const restrictions: DateRestriction[] = [
        {
          condition: '>',
          type: 'ref',
          value: 'test',
          precision: 'firstDate'
        },
      ];
      service.setDateRefs(
        restrictions,
        [{ id: 'test', value: '', attrs: {}, type: CustomScreenComponentTypes.DateInput }],
        new FormArray([new FormControl({ value: { firstDate: '2021-08-23T00:00:00.000Z' }, id: 'test' })]),
        {},
      );
      expect(restrictions[0].value).toEqual('23.08.2021');
    });

    it('should correctly set refs for applicant answers', () => {
      const restrictions: DateRestriction[] = [
        {
          condition: '>',
          type: 'ref',
          value: 'test',
        },
      ];
      service.setDateRefs(
        restrictions,
        [],
        new FormArray([]),
        { test: { visited: true, value: '1979-07-05T00:00:00.000Z' }},
      );
      expect(restrictions[0].value).toEqual('05.07.1979');
    });

    it('should correctly set refs for applicant answers', () => {
      const restrictions: DateRestriction[] = [
        {
          condition: '>',
          type: 'ref',
          value: 'test',
          precision: 'firstDate'
        },
      ];
      service.setDateRefs(
        restrictions,
        [],
        new FormArray([]),
        { test: { visited: true, value: '{ "firstDate": "1979-07-05T00:00:00.000Z" }' }},
      );
      expect(restrictions[0].value).toEqual('05.07.1979');
    });

  });

  describe('getDateRangeFromStore() method', () => {
    it('should return range for component or undefined', async () => {
      expect(service.getDateRangeFromStore('compId')).toBeUndefined();

      await service.getDateRange(
        'compId',
        [
          {
            condition: '>',
            type: 'const',
            value: 'today',
          },
        ],
        [],
        new FormArray([]),
        {},
      );

      expect(service.getDateRangeFromStore('compId')).toEqual({
        min: new Date('2021-01-02T00:00:00.000Z'),
        max: null,
      });
    });

    it('should return range for component or undefined for compound components', async () => {
      expect(service.getDateRangeFromStore('compId')).toBeUndefined();
      await service.getDateRange(
        'compId',
        [
          {
            condition: '>',
            type: 'const',
            value: 'today',
          },
        ],
        [],
        new FormArray([]),
        {},
        'test'
      );
      expect(service.getDateRangeFromStore('compId', undefined, 'test')).toEqual({
        min: new Date('2021-01-02T00:00:00.000Z'),
        max: null,
      });
    });
  });

  describe('haveDateRef() method', () => {
    it('should return TRUE if restriction type is "ref"', () => {
      expect(
        service.haveDateRef({
          condition: '>',
          type: 'ref',
          value: 'today',
        }),
      ).toBeTruthy();

      expect(
        service.haveDateRef({
          condition: '>',
          type: 'const',
          value: 'today',
        }),
      ).toBeFalsy();
    });
  });
});
