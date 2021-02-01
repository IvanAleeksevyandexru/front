import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

import { EmployeeHistoryDescriptionComponent } from './employee-history-description.component';

describe('EmployeeHistoryDescriptionComponent', () => {
  let component: EmployeeHistoryDescriptionComponent;
  let fixture: ComponentFixture<EmployeeHistoryDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeHistoryDescriptionComponent],
    })
      .overrideComponent(EmployeeHistoryDescriptionComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeHistoryDescriptionComponent);
    component = fixture.componentInstance;
    component.years = 2010;
    component.isCompleted = true;
    component.periods = [{ from: '01.01.2020', to: '01.01.2021' }];
    fixture.detectChanges();
  });

  describe('EmployeeHistoryDescriptionComponent', () => {
    it('should be return date from', () => {
      const period = { from: '01.01.2020', to: '01.01.2020' };
      const result = component.getPeriod(period);
      expect(result).toBe('01.01.2020');
    });

    it('should be return date from - to', () => {
      const period = { from: '01.01.2020', to: '01.01.2021' };
      const result = component.getPeriod(period);
      expect(result).toBe('01.01.2020 — 01.01.2021');
    });
  });

  describe('Progress template', () => {
    const selector = '.employee-history__progress';

    it('should be show progress template if has periods', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });

    it('should be not show progress template if has not periods', () => {
      component.periods = [];
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();
    });
  });

  describe('Completed template', () => {
    const selector = '.employee-history__completed';

    it('should be show completed template if isCompleted', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });

    it('should be not show completed template if !isCompleted', () => {
      component.isCompleted = false;
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();
    });
  });
});
