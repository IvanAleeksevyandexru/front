import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputErrorComponent } from './input-error.component';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

const helperTextMock = 'Awesome useful helper text.';

@Component({
  template: `<epgu-cf-ui-constructor-input-error
    >${helperTextMock}</epgu-cf-ui-constructor-input-error
  >`,
})
class WrapperTestComponent {}

describe('InputErrorComponent', () => {
  let component: WrapperTestComponent;
  let fixture: ComponentFixture<WrapperTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WrapperTestComponent, InputErrorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render passed content', () => {
    const helperText = fixture.debugElement.query(By.css('.error')).nativeElement.textContent;
    expect(helperText).toEqual(helperTextMock);
  });
});
