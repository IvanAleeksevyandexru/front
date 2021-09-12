import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';

import { ChipComponent } from './chip.component';
import { configureTestSuite } from 'ng-bullet';
import { By } from '@angular/platform-browser';

describe('ChipComponent', () => {
  let component: ChipComponent;
  let fixture: ComponentFixture<ChipComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ChipComponent],
    })
      .overrideComponent(ChipComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render label', () => {
    component.label = 'some label';
    fixture.detectChanges();

    expect(fixture.nativeElement.innerHTML.includes('some label')).toBeTruthy();
  });

  it('should emit closeEvent with id OR label input', () => {
    jest.spyOn(component.closeEvent, 'emit');

    const debugEl = fixture.debugElement.query(By.css('.cross-btn'));
    debugEl.triggerEventHandler('click', undefined);

    expect(component.closeEvent.emit).toBeCalledTimes(1);
    // не определены ни id, ни label, поэтому передается undefined
    expect(component.closeEvent.emit).toBeCalledWith(undefined);
    (component.closeEvent.emit as jest.Mock).mockClear();

    component.label = 'some label';
    debugEl.triggerEventHandler('click', undefined);

    expect(component.closeEvent.emit).toBeCalledTimes(1);
    // id пустой, label не пустой, в этом случае передается label
    expect(component.closeEvent.emit).toBeCalledWith('some label');
    (component.closeEvent.emit as jest.Mock).mockClear();

    component.id = 'some id';
    debugEl.triggerEventHandler('click', undefined);

    expect(component.closeEvent.emit).toBeCalledTimes(1);
    // id и label не пустые, в этом случае передается id
    expect(component.closeEvent.emit).toBeCalledWith('some id');
  });

  describe('Unselectable', () => {
    it ('should not render remove button if unselectable is TRUE', () => {
      component.unselectable = true;
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css('.cross-btn'));
      expect(debugEl).toBeFalsy();
    });
  });
});
