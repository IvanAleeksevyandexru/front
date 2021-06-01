import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { CycledInfoComponent } from './cycled-info.component';

const mockValue = [{
  fieldName: 'ai19_1.value',
  value: 'fake value',
  isBold: false
}];

describe('CycledInfoComponent', () => {
  let component: CycledInfoComponent;
  let fixture: ComponentFixture<CycledInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CycledInfoComponent],
    })
      .overrideComponent(CycledInfoComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CycledInfoComponent);
    component = fixture.componentInstance;
    component.value = mockValue as any;
    fixture.detectChanges();
  });

  describe('should create', () => {
    const selector = '.cycled-info-text';

    it('be true', () => {
      expect(fixture.debugElement.query(By.css(selector))).not.toBeNull();
    });

    it('be false', () => {
      component.value = '' as any;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(selector))).toBeNull();
    });
  });

  describe('check isBold class', () => {
    const selector = '.fw-bold';

    it('not found', () => {
      expect(fixture.debugElement.query(By.css(selector))).toBeNull();
    });

    it('found', () => {
      mockValue[0].isBold = true;
      component.value = mockValue as any;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(selector))).not.toBeNull();
    });
  });
});
