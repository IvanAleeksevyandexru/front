import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongButtonColor } from '@epgu/epgu-constructor-types';
import { LongButtonComponent } from './long-button.component';

const helperTextMock = 'Awesome useful helper text.';

@Component({
  template: `
    <epgu-cf-ui-long-button [isLoading]="isLoading" [disabled]="disabled" [showShadow]="showShadow" [color]="color">
      ${helperTextMock}
    </epgu-cf-ui-long-button>
  `,
})
class WrapperTestComponent {
  @Input() disabled: boolean;
  @Input() isLoading: boolean;
  @Input() showShadow = true;
  @Input() color: LongButtonColor = LongButtonColor.WHITE;
}

describe('LongButtonComponent', () => {
  let component: WrapperTestComponent;
  let fixture: ComponentFixture<WrapperTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WrapperTestComponent, LongButtonComponent],
    })
      .overrideComponent(LongButtonComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('button element', () => {
    const selector = 'epgu-cf-ui-long-button button';
    it('should be rendered', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });

    it('loading class should be if isLoading is TRUE', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.nativeElement.classList.contains('loading')).toBeFalsy();

      component.isLoading = true;
      fixture.detectChanges();

      expect(debugEl.nativeElement.classList.contains('loading')).toBeTruthy();
    });

    it('disabled attribute should be TRUE if disabled', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.nativeElement.disabled).toBeFalsy();

      component.disabled = true;
      fixture.detectChanges();

      expect(debugEl.nativeElement.disabled).toBeTruthy();
    });

    it('should render passed content', () => {
      const helperText = fixture.debugElement.query(By.css(selector)).nativeElement.textContent;
      expect(helperText.includes(helperTextMock)).toBeTruthy();
    });

    it('should add white color class by default', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.nativeElement.classList.contains('btn--white')).toBeTruthy();
    });

    it('should add blue color class from @Input "color"', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.nativeElement.classList.contains('btn--blue')).toBeFalsy();

      component.color = LongButtonColor.BLUE;
      fixture.detectChanges();

      expect(debugEl.nativeElement.classList.contains('btn--blue')).toBeTruthy();
    });

    it('should add shadow class by default', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.nativeElement.classList.contains('btn--shadow')).toBeTruthy();
    });

    it('should not add shadow class if @Input "shadow" is false', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.nativeElement.classList.contains('btn--shadow')).toBeTruthy();

      component.showShadow = false;
      fixture.detectChanges();

      expect(debugEl.nativeElement.classList.contains('btn--shadow')).toBeFalsy();
    });
  });
});
