import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HelperTextComponent } from './helper-text.component';
import { configureTestSuite } from 'ng-bullet';

const helperTextMock = 'Awesome useful helper text.';

@Component({
  template: `<epgu-cf-ui-constructor-helper-text
    >${helperTextMock}</epgu-cf-ui-constructor-helper-text
  >`,
})
class WrapperTestComponent {}

describe('HelperTextComponent', () => {
  let component: WrapperTestComponent;
  let fixture: ComponentFixture<WrapperTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [WrapperTestComponent, HelperTextComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperTestComponent);
    component = fixture.componentInstance;
  });

  it('should match snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should render passed content', () => {
    const helperText = fixture.debugElement.query(By.css('.helper-text')).nativeElement.textContent;
    expect(helperText).toEqual(helperTextMock);
  });
});
