import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { DayComponent } from './day.component';
import { DatesToolsService, DatesToolsServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { By } from '@angular/platform-browser';

const testDate = new Date('2012-12-12');

describe('DayComponent', () => {
  let component: DayComponent;
  let fixture: ComponentFixture<DayComponent>;
  let dateService: DatesToolsService;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [DayComponent],
      imports: [],
      providers: [{ provide: DatesToolsService, useClass: DatesToolsServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    dateService = TestBed.inject(DatesToolsService);
    fixture = TestBed.createComponent(DayComponent);
    component = fixture.componentInstance;

    component.day$$.next(testDate);
    component.today$$.next(testDate);
    component.selected$$.next(testDate);
    component.firstDayOfMainSection$$.next(testDate);
    component.daysInMainSection$$.next(1);
    component.month$$.next([12, 2012]);
    jest.spyOn(dateService, 'getDate').mockReturnValue(12);
  });

  describe('base', () => {
    it('should be day number', () => {
      fixture.detectChanges();
      const element: HTMLSpanElement = fixture.debugElement.query(By.css('.calendar-day-text'))
        .nativeElement;
      expect(element.innerHTML).toBe('12');
    });

    it('should be choose', () => {
      jest.spyOn(component, 'chooseAction');

      fixture.debugElement.query(By.css('.calendar-day')).nativeElement.click();

      expect(component.chooseAction).toHaveBeenCalled();
    });
  });

  describe('classses', () => {
    it('should be isPast', () => {
      jest.spyOn(dateService, 'differenceInCalendarDays').mockReturnValueOnce(-1);
      fixture.detectChanges();
      const element: HTMLDivElement = fixture.debugElement.query(By.css('.calendar-day'))
        .nativeElement;

      expect(element.classList.contains('is-past')).toBeTruthy();
    });

    it('should be today', () => {
      jest.spyOn(component, 'isToday').mockReturnValueOnce(true);
      fixture.detectChanges();
      const element: HTMLDivElement = fixture.debugElement.query(By.css('.calendar-day'))
        .nativeElement;
      expect(element.classList.contains('today')).toBeTruthy();
    });

    it('should be locked', () => {
      component.isLocked = true;
      fixture.detectChanges();
      const element: HTMLDivElement = fixture.debugElement.query(By.css('.calendar-day'))
        .nativeElement;
      expect(element.classList.contains('locked')).toBeTruthy();
    });

    it('should be selected', () => {
      jest.spyOn(component, 'isSelected').mockReturnValueOnce(true);
      fixture.detectChanges();
      const element: HTMLDivElement = fixture.debugElement.query(By.css('.calendar-day'))
        .nativeElement;
      expect(element.classList.contains('selected')).toBeTruthy();
    });

    it('should be outer-month', () => {
      jest.spyOn(component, 'isDateOutOfMonth').mockReturnValueOnce(true);
      fixture.detectChanges();
      const element: HTMLDivElement = fixture.debugElement.query(By.css('.calendar-day'))
        .nativeElement;

      expect(element.classList.contains('outer-month')).toBeTruthy();
    });

    it('should be outer-section', () => {
      jest.spyOn(dateService, 'isDateOutOfSection').mockReturnValueOnce(true);
      fixture.detectChanges();
      const element: HTMLDivElement = fixture.debugElement.query(By.css('.calendar-day'))
        .nativeElement;

      expect(element.classList.contains('outer-section')).toBeTruthy();
    });

    it('should be visible', () => {
      jest.spyOn(component, 'isDateOutOfMonth').mockReturnValueOnce(true);
      jest.spyOn(dateService, 'isDateOutOfSection').mockReturnValueOnce(false);
      fixture.detectChanges();
      const element: HTMLDivElement = fixture.debugElement.query(By.css('.calendar-day'))
        .nativeElement;

      expect(element.classList.contains('visible')).toBeTruthy();
    });
  });
});
