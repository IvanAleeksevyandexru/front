import { TestBed } from '@angular/core/testing';
import {
  ConfigService,
  DatesToolsService,
  DatesToolsServiceStub,
  LoggerService,
} from '@epgu/epgu-constructor-ui-kit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockProvider } from 'ng-mocks';
import { MonthYear } from '@epgu/ui/models/date-time';
import { EmployeeHistoryAvailableDates, EmployeeHistoryModel } from '../employee-history.types';
import { EmployeeHistoryMonthsService } from './employee-history.months.service';

describe('EmployeeHistoryMonthsService', () => {
  let service: EmployeeHistoryMonthsService;
  let datesToolsService: DatesToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EmployeeHistoryMonthsService,
        MockProvider(ConfigService),
        MockProvider(LoggerService),
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
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
      jest
        .spyOn(EmployeeHistoryMonthsService.prototype as any, 'getAvailableMonths')
        .mockReturnValueOnce([
          { date: '', checked: true },
          { date: '', checked: true },
        ]);
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
          from: '???????????? 2020',
          to: '???????????? 2020',
        },
      ];
      const availableMonths: EmployeeHistoryAvailableDates[] = [
        {
          checked: false,
          date: '01/2020',
        },
      ];
      jest.spyOn(datesToolsService, 'format').mockImplementation((...args) => '???????????? 2020');
      const value = service.getUncheckedPeriods(availableMonths);
      expect(value).toEqual(expectedValue);
    });

    it('if all month checked periods = []', () => {
      const availableMonths: EmployeeHistoryAvailableDates[] = [
        {
          checked: true,
          date: '01/2020',
        },
        {
          checked: true,
          date: '01/2020',
        },
      ];
      const value = service.getUncheckedPeriods(availableMonths);
      expect(value).toEqual([]);
    });
  });

  describe('updateAvailableMonths', () => {
    it('should be change availableMonths', async () => {
      jest.spyOn(datesToolsService, 'getToday').mockResolvedValue(new Date());
      const expectedMonth: EmployeeHistoryAvailableDates = {
        date: '01/2021',
        checked: true,
      };
      const generation: EmployeeHistoryModel[] = [
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
      jest
        .spyOn(EmployeeHistoryMonthsService.prototype as any, 'getAvailableMonths')
        .mockReturnValueOnce([{ date: '01/2021', checked: true }]);
      await service.initSettings();
      const month = service.availableMonths.find(
        (availableMonth) => availableMonth.date === '01/2021',
      );
      expect(month).toEqual(expectedMonth);
      await service.updateAvailableMonths(generation);
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

    it('should be call checkMonthCompleted if (from && to) undefined', async () => {
      const generation: EmployeeHistoryModel[] = [
        {
          from: undefined,
          to: undefined,
        },
      ];
      const checkMonthCompleted = jest.spyOn(
        EmployeeHistoryMonthsService.prototype as any,
        'checkMonthCompleted',
      );
      await service.updateAvailableMonths(generation);
      expect(checkMonthCompleted).toHaveBeenCalled();
    });
  });
});
