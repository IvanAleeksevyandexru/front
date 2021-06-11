import { TestBed } from '@angular/core/testing';
import { MonthYear } from '@epgu/epgu-lib';

import { ConfigService, DatesToolsService, LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { EmployeeHistoryMonthsService } from './employee-history.months.service';
import { EmployeeHistoryAvailableDates, EmployeeHistoryModel } from '../employee-history.types';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

describe('EmployeeHistoryMonthsService', () => {
  let service: EmployeeHistoryMonthsService;
  let datesToolsService: DatesToolsService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EmployeeHistoryMonthsService,
        DatesToolsService,
        ConfigService,
        LoggerService,
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(EmployeeHistoryMonthsService);
    datesToolsService = TestBed.inject(DatesToolsService);
  });

  describe('initSettings', () => {
    it('should be set minDateFrom, minDateTo, maxDate, availableMonths', async () => {
      jest.spyOn(datesToolsService, 'getToday').mockResolvedValue(new Date());
      const dateMock = new MonthYear(1, 2021);
      jest.spyOn(MonthYear, 'fromDate').mockReturnValue(dateMock);
      await service.initSettings();

      expect(service.minDateFrom).toEqual(dateMock);
      expect(service.minDateTo).toEqual(dateMock);
      expect(service.maxDate).toEqual(dateMock);
      expect(service.availableMonths.length).toBeGreaterThan(0);
    });
  });

  describe('getUncheckedPeriods', () => {
    it('should be return empty array', () => {
      const expectedValue = [];
      const value = service.getUncheckedPeriods([]);

      expect(value).toEqual(expectedValue);
    });

    it('should be return EmployeeHistoryUncheckedPeriod array', () => {
      const expectedValue = [
        {
          from: 'январь 2020',
          to: 'январь 2020',
        },
      ];
      const availableMonths: EmployeeHistoryAvailableDates[] = [
        {
          checked: false,
          date: '01/2020',
        },
      ];
      const value = service.getUncheckedPeriods(availableMonths);
      expect(value).toEqual(expectedValue);
    });
  });

  describe('updateAvailableMonths', () => {
    it('should be change availableMonths', async () => {
      jest.spyOn(datesToolsService, 'getToday').mockResolvedValue(new Date());
      const expectedMonth: EmployeeHistoryAvailableDates = {
        date: '01/2021',
        checked: true,
      };
      const generation: Array<EmployeeHistoryModel> = [
        {
          type: 'student',
          from: new MonthYear(11, 2020),
          to: new MonthYear(1, 2021),
          error: null,
          position: null,
          place: null,
          address: null,
          checkboxToDate: false,
          minDateTo: new MonthYear(11, 2020),
          label: '',
        },
      ];
      const dateMock = new MonthYear(1, 2021);
      jest.spyOn(MonthYear, 'fromDate').mockReturnValue(dateMock);
      await service.initSettings();
      await service.updateAvailableMonths(generation);
      const month = service.availableMonths.find((month) => month.date === '01/2021');
      expect(month).toEqual(expectedMonth);
    });

    it('should be call isMonthComplete$', async () => {
      jest.spyOn(datesToolsService, 'getToday').mockResolvedValue(new Date());
      jest.spyOn(service.isMonthComplete$, 'next');
      await service.updateAvailableMonths([]);
      expect(service.isMonthComplete$.next).toHaveBeenCalled();
    });

    it('should be call isMonthComplete$ if isNonStop', async () => {
      jest.spyOn(datesToolsService, 'getToday').mockResolvedValue(new Date());
      jest.spyOn(service.isMonthComplete$, 'next');
      service.isNonStop = true;
      await service.updateAvailableMonths([]);
      expect(service.isMonthComplete$.next).toHaveBeenCalled();
    });
  });
});
