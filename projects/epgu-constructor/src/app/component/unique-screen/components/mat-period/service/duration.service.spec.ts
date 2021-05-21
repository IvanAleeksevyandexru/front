import { TestBed } from '@angular/core/testing';
import { ListElement } from 'epgu-lib';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DurationService } from './duration.service';
import { DatesToolsService } from '../../../../../core/services/dates-tools/dates-tools.service';
import { ValidationService } from '../../../../../shared/services/validation/validation.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { DateRangeService } from '../../../../../shared/services/date-range/date-range.service';
import { configureTestSuite } from 'ng-bullet';

describe('DurationService', () => {
  let service: DurationService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        DurationService,
        DatesToolsService,
        ValidationService,
        DateRangeService,
        { provide: ScreenService, use: ScreenServiceStub },
      ],
      imports: [HttpClientTestingModule],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DurationService);
  });

  it('should be created month range', () => {
    const expectedMonthRange = [
      { text: 'январь 2020', id: 0, date: '01.01.2020', value: 0 },
      { text: 'февраль 2020', id: 1, date: '01.02.2020', value: 1 },
      { text: 'март 2020', id: 2, date: '01.03.2020', value: 2 },
    ];
    const start = new Date('01.01.2020');
    const finish = new Date('03.01.2020');
    const monthRange = service.getMonthRange(start, finish);
    expect(monthRange).toEqual(expectedMonthRange);
  });

  it('should be created quarter range', () => {
    const expectedQuarterRange = [
      {
        date: '01.01.2020',
        id: 0,
        text: '1 квартал 2020',
        value: 0,
      },
      {
        date: '01.04.2020',
        id: 1,
        text: '2 квартал 2020',
        value: 1,
      },
    ];
    const start = new Date('01.01.2020');
    const finish = new Date('06.01.2020');
    const quarterRange = service.getQuarterRange(start, finish);
    expect(quarterRange).toEqual(expectedQuarterRange);
  });

  it('should be created half year range', () => {
    const expectedHalfYearRange = [
      {
        date: '01.07.2019',
        id: 0,
        text: '2 полугодие 2019',
        value: 0,
      },
      {
        date: '01.01.2020',
        id: 1,
        text: '1 полугодие 2020',
        value: 1,
      },
      {
        date: '01.07.2020',
        id: 2,
        text: '2 полугодие 2020',
        value: 2,
      },
      {
        date: '01.01.2021',
        id: 3,
        text: '1 полугодие 2021',
        value: 3,
      },
    ];
    const start = new Date('01.01.2020');
    const halfYearRange = service.getHalfYearRange(start);
    expect(halfYearRange).toEqual(expectedHalfYearRange);
  });

  it('should be created year finish range', () => {
    const expectedYearFinishRange = [
      {
        date: '01.03.2020',
        id: 0,
        text: 'март 2020',
        value: 0,
      },
      {
        date: '01.03.2021',
        id: 1,
        text: 'март 2021',
        value: 1,
      },
      {
        date: '01.03.2022',
        id: 2,
        text: 'март 2022',
        value: 2,
      },
      {
        date: '01.03.2023',
        id: 3,
        text: 'март 2023',
        value: 3,
      },
      {
        date: '01.03.2024',
        id: 4,
        text: 'март 2024',
        value: 4,
      },
    ];
    const start: ListElement = { text: 'март 2020', id: 2, date: '01.03.2020', value: 2 };
    const yearFinishRange = service.getYearFinishRange(start);
    expect(yearFinishRange).toEqual(expectedYearFinishRange);
  });

  describe('transformDayToDate', () => {
    it('should be created set day to current date', () => {
      const monthDate = service.transformDayToDate('5', '01.03.2021', 'month');
      expect(monthDate).toBe('05.03.2021');
      const yearDate = service.transformDayToDate('5', '01.03.2022', 'year');
      expect(yearDate).toBe('05.03.2022');
    });

    it('should be return day if !date || !day', () => {
      const day = service.transformDayToDate('3', null, 'halfYear');
      expect(day).toBe('3');
    });

    it('should be return day if paymentType === one', () => {
      const day = service.transformDayToDate('5', '01.03.2021', 'one');
      expect(day).toBe('5');
    });
  });
});
