import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenPadComponent } from './screen-pad.component';
import { Component } from '@angular/core';

const helperTextMock = 'Awesome useful helper text.';

@Component({
  template: `<epgu-cf-ui-constructor-screen-pad
    >${helperTextMock}</epgu-cf-ui-constructor-screen-pad
  >`,
})
class WrapperTestComponent {}

describe('AppCardComponent', () => {
  let component: WrapperTestComponent;
  let fixture: ComponentFixture<ScreenPadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WrapperTestComponent, ScreenPadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render passed content', () => {
    const helperText = fixture.nativeElement.textContent;
    expect(helperText.includes(helperTextMock)).toBeTruthy();
  });
});
