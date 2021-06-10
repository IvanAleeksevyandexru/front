import { configureTestSuite } from 'ng-bullet';
import { TestBed } from '@angular/core/testing';
import { DateRestrictionsService } from './date-restrictions.service';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { FormArray } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../../core/services/config/config.service';
import { LoggerService } from '../../../core/services/logger/logger.service';

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
      ],
      imports: [HttpClientTestingModule]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DateRestrictionsService);
    datesToolsService = TestBed.inject(DatesToolsService);

    jest.spyOn(datesToolsService, 'getToday').mockResolvedValue(new Date('2021-01-01T00:00:00.000Z'));
  });

  describe('getDateRange() method', () => {
    it('should calculate range', async () => {
      const range = await service.getDateRange(
      'compId',
      [{
          condition: '>',
          type: 'const',
          value: 'today'
        }],
        [],
        new FormArray([]),
        {}
      );


      expect(range).toEqual({
        min: new Date('2021-01-02T00:00:00.000Z'),
        max: null
      });
    });
  });

  describe('getDateRangeFromStore() method', () => {
    it('should return range for component or undefined', async () => {
      expect(service.getDateRangeFromStore('compId')).toBeUndefined();

      await service.getDateRange(
        'compId',
        [{
          condition: '>',
          type: 'const',
          value: 'today'
        }],
        [],
        new FormArray([]),
        {}
      );

      expect(service.getDateRangeFromStore('compId')).toEqual({
        min: new Date('2021-01-02T00:00:00.000Z'),
        max: null
      });
    });
  });

  describe('haveDateRef() method', () => {
    it('should return TRUE if restriction type is "ref"', () => {
      expect(service.haveDateRef({
        condition: '>',
        type: 'ref',
        value: 'today'
      })).toBeTruthy();

      expect(service.haveDateRef({
        condition: '>',
        type: 'const',
        value: 'today'
      })).toBeFalsy();
    });
  });

});
