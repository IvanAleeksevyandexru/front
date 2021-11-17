import { TestBed } from '@angular/core/testing';

import { TimeSlotCalendarService } from './time-slot-calendar.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { DatesToolsService, DatesToolsServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { DateTypeTypes } from '../../time-slot.const';
import { take } from 'rxjs/operators';

describe('TimeSlotCalendarService', () => {
  let service: TimeSlotCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TimeSlotCalendarService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
      ],
    });
    service = TestBed.inject(TimeSlotCalendarService);
    service = TestBed.inject(TimeSlotCalendarService);
  });

  describe('base', () => {
    const today = new Date('2012-12-12');
    const refDate = '2012-12-13';
    it('should be getRefDate', () => {
      expect(service.getRefDate(today, DateTypeTypes.TODAY, refDate)).toBe(today);
      expect(service.getRefDate(today, DateTypeTypes.REF_DATE, refDate)).toEqual(new Date(refDate));
    });
    it('should be addMonth', () => {
      service.addMonth('2012-12');
      expect(Array.from(service.monthList.getValue())).toEqual(['2012-12']);
    });
    it('should be resetToday', (done) => {
      service.today$$.pipe(take(1)).subscribe((v) => {
        expect(v).toBeNull();
        done();
      });
      service.resetToday();
    });
  });
});
