import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { EmployeeHistoryClarificationComponent } from './employee-history-clarification.component';
import { ClickableLabelDirective } from '../../../../../../shared/directives/clickable-label/clickable-label.directive';

describe('EmployeeHistoryClarificationComponent', () => {
  let component: EmployeeHistoryClarificationComponent;
  let fixture: ComponentFixture<EmployeeHistoryClarificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeHistoryClarificationComponent, MockComponent(ClickableLabelDirective)],
    })
      .overrideComponent(EmployeeHistoryClarificationComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeHistoryClarificationComponent);
    component = fixture.componentInstance;
    component.clarifications = { student: { position: {}}} as any;
    fixture.detectChanges();
  });

  it('should isShow true and render', () => {
    component.type = 'student';
    component.clarificationId = 'position';
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.isShow).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ClickableLabelDirective))).not.toBeNull();
  });

  it('should isShow false and not render', () => {
    component.type = 'test1';
    component.clarificationId = 'test2';
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.isShow).toBeUndefined();
    expect(fixture.debugElement.query(By.directive(ClickableLabelDirective))).toBeNull();
  });
});
