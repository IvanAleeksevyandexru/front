import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongButtonComponent } from './long-button.component';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentActionDto, ComponentAnswerDto } from '@epgu/epgu-constructor-types';

const helperTextMock = 'Awesome useful helper text.';

@Component({
  template: `
    <epgu-cf-ui-long-button [isLoading]="isLoading" [disabled]="disabled" [data]="data">
        ${helperTextMock}
    </epgu-cf-ui-long-button>
  `
})
class WrapperTestComponent {
  @Input() isLoading: boolean;
  @Input() disabled: boolean;
  @Input() data: Partial<ComponentActionDto | ComponentAnswerDto>;
}

describe('LongButtonComponent', () => {
  let component: WrapperTestComponent;
  let fixture: ComponentFixture<WrapperTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ WrapperTestComponent, LongButtonComponent ]
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

    it('disabled attribute should be TRUE if data?.disabled || disabled', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.nativeElement.disabled).toBeFalsy();

      component.disabled = true;
      fixture.detectChanges();

      expect(debugEl.nativeElement.disabled).toBeTruthy();

      component.disabled = false;
      component.data = {
        disabled: true
      };
      fixture.detectChanges();

      expect(debugEl.nativeElement.disabled).toBeTruthy();
    });

    it('should render passed content', () => {
      const helperText = fixture.debugElement
        .query(By.css(selector)).nativeElement.textContent;
      expect(helperText.includes(helperTextMock)).toBeTruthy();
    });
  });
});
