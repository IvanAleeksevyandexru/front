import { TestBed } from '@angular/core/testing';
import { ListElement } from 'epgu-lib';

import { DurationService } from './duration.service';
import { DatesToolsService } from '../../../../../core/services/dates-tools/dates-tools.service';
import { ValidationService } from '../../../../../shared/services/validation/validation.service';
import { DateRangeService } from '../../../../shared/components/components-list/services/date-range/date-range.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';

describe('DurationService', () => {
  let service: DurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DurationService,
        DatesToolsService,
        ValidationService,
        DateRangeService,
        { provide: ScreenService, use: ScreenServiceStub },
      ],
    });
    service = TestBed.inject(DurationService);
  });

  // it('should be create durations', () => {
  //   const mockDate = (date: Date) => {
  //     const mockDate = new Date('12.09.2021');
  //     return jest
  //       .spyOn(global, 'Date')
  //       .mockImplementationOnce(() => mockDate)
  //       .mockImplementation(() => date);
  //   };
  //   const expectedDuration = {
  //     halfYear: [
  //       {
  //         date: '30.06.2025',
  //         id: 0,
  //         text: '2 полугодие 2025',
  //         value: 0,
  //       },
  //       {
  //         date: '30.06.2025',
  //         id: 1,
  //         text: '2 полугодие 2025',
  //         value: 1,
  //       },
  //       {
  //         date: '30.06.2025',
  //         id: 2,
  //         text: '2 полугодие 2025',
  //         value: 2,
  //       },
  //       {
  //         date: '30.06.2025',
  //         id: 3,
  //         text: '2 полугодие 2025',
  //         value: 3,
  //       },
  //     ],
  //     month: [
  //       {
  //         date: '31.12.2021',
  //         id: 0,
  //         text: 'декабрь 2021',
  //         value: 0,
  //       },
  //     ],
  //     one: [],
  //     quarter: [
  //       {
  //         date: '31.12.2022',
  //         id: 0,
  //         text: '4 квартал 2022',
  //         value: 0,
  //       },
  //     ],
  //     year: [
  //       {
  //         date: '30.04.2026',
  //         id: 0,
  //         text: 'апрель 2026',
  //         value: 0,
  //       },
  //     ],
  //   };
  //   const spy = mockDate(new Date);
  //   const duration = service.initDurations();
  //   spy.mockRestore();
  //   expect(duration).toEqual(expectedDuration);
  // });

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
      {
        date: '01.03.2025',
        id: 5,
        text: 'март 2025',
        value: 5,
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
