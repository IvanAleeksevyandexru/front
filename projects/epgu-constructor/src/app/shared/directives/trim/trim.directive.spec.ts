import { TrimDirective } from './trim.directive';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

@Component({
  template: ' <input [value]="value" epgu-constructor-trim /> ',
})
class MockComponent {
  @Input() value: string;
}

describe('TrimDirective', () => {
  let directive: TrimDirective;
  let inputValue: string;

  beforeEach(
    waitForAsync(() => {
      directive = new TrimDirective();
    }),
  );

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
  it('should check for trimControl', () => {
    directive.trimControl = new FormControl(' dsf sdfsdf ');

    directive.onFocusOut(null as any);

    expect(directive.trimControl.value).toBe('dsf sdfsdf');
  });
  it('should remove non alphabetic or numeral symbols from beginning', () => {
    inputValue = '   42Тыц   8тыц -тац тац-тац';
    const value = directive.removeNonAlphabeticOrNumeralSymbolsFromBeginning(inputValue);
    expect(value).toEqual('42Тыц   8тыц -тац тац-тац');
  });

  it('should remove extra spaces between words', () => {
    inputValue = '42Тыц   8тыц -тац тац-тац';
    const value = directive.removeExtraSpacesBetweenWords(inputValue);
    expect(value).toEqual('42Тыц 8тыц -тац тац-тац');
  });

  describe('TrimDirective integration', () => {
    let component: MockComponent;
    let fixture: ComponentFixture<MockComponent>;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [TrimDirective, MockComponent],
        }).compileComponents();
      }),
    );

    beforeEach(
      waitForAsync(() => {
        fixture = TestBed.createComponent(MockComponent);
        component = fixture.componentInstance;
        component.value = '   42Тыц   8тыц -тац тац-тац';
        fixture.detectChanges();
      }),
    );

    it('should trim extra spaces when focus out', () => {
      const input = fixture.debugElement.nativeElement.querySelector('input');
      input.focus();
      input.blur();
      fixture.detectChanges();
      const value = input.value;
      expect(value).toEqual('42Тыц 8тыц -тац тац-тац');
    });
  });
});
