import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DaySelectorComponent } from './day-selector.component';
import { DatesToolsService, DatesToolsServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { DayComponent } from '../day/day.component';
import { MockComponent } from 'ng-mocks';
import { SectionType } from '@epgu/epgu-constructor-types';
import { addDays } from 'date-fns';
import { By } from '@angular/platform-browser';
import { take } from 'rxjs/operators';

describe('DaySelectorComponent', () => {
  let component: DaySelectorComponent;
  let fixture: ComponentFixture<DaySelectorComponent>;
  let dateService: DatesToolsService;
  const today = new Date('2012-12-12');
  const testDate = new Date('2011-12-12');

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DaySelectorComponent, MockComponent(DayComponent)],
      imports: [],
      providers: [{ provide: DatesToolsService, useClass: DatesToolsServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    dateService = TestBed.inject(DatesToolsService);
    fixture = TestBed.createComponent(DaySelectorComponent);
    component = fixture.componentInstance;
    component.month$$.next('2012-12');
    component.today$$.next(today);
    jest.spyOn(dateService, 'getDaysInMonth').mockReturnValue(5);
    jest.spyOn(dateService, 'setCalendarDate').mockReturnValue(testDate);
    jest.spyOn(dateService, 'differenceInCalendarDays').mockReturnValue(2);
    jest.spyOn(dateService, 'startOfISOWeek').mockReturnValue(testDate);
    jest.spyOn(dateService, 'endOfISOWeek').mockReturnValue(testDate);
    jest.spyOn(dateService, 'isDateOutOfSection').mockReturnValue(false);
    jest.spyOn(dateService, 'format').mockReturnValue('monthName');
    component.lockProvider$$.next(() => false);
    jest
      .spyOn(dateService, 'add')
      .mockImplementation((day, amount: number) => addDays(day, amount));
  });

  describe('base', () => {
    it('should be month$', (done) => {
      component.month$.pipe(take(1)).subscribe((v) => {
        expect(v).toEqual([2012, 11]);
        done();
      });
      component.month$$.next('2012-12');
    });
    it('should be firstDayOfMainSection$ - today ', (done) => {
      component.startSection$$.next(SectionType.today);
      component.firstDayOfMainSection$.subscribe((v) => {
        expect(v).toBe(today);
        done();
      });
    });
    it('should be firstDayOfMainSection$ - normal ', (done) => {
      component.firstDayOfMainSection$.subscribe((v) => {
        expect(v).toEqual(testDate);
        done();
      });
    });
    it('should be daysInMainSection$ - has daysToShow', (done) => {
      const testNumber = 5;
      component.daysToShow$$.next(testNumber);
      component.daysInMainSection$.subscribe((v) => {
        expect(v).toBe(testNumber);
        done();
      });
    });
    it('should be daysInMainSection$ - daysToShow = null', (done) => {
      component.daysInMainSection$.subscribe((v) => {
        expect(v).toBe(5);
        done();
      });
    });

    it('should be createDays', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('epgu-constructor-day')).length).toBe(3);
    });

    it('should be notExistsAvailable$ = true', (done) => {
      component.lockProvider$$.next(() => true);
      component.notExistsAvailable.subscribe((v) => {
        expect(v).toBeTruthy();
        done();
      });
      fixture.detectChanges();
    });
    it('should be notExistsAvailable$ = false', (done) => {
      component.notExistsAvailable.subscribe((v) => {
        expect(v).toBeFalsy();
        done();
      });
      fixture.detectChanges();
    });
  });
});
