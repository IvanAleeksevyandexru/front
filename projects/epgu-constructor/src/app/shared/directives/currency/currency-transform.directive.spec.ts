import { CurrencyTransformDirective } from './currency-transform.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyPipe } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'epgu-constructor-currency-transform-test-component',
  template: ' <input type="text" [epgu-constructor-currency-transform]="true" /> ',
})
class CurrencyTransformTestComponent {}

describe('CurrencyTransformDirective', () => {
  let fixture: ComponentFixture<CurrencyTransformTestComponent>;
  let comp: CurrencyTransformTestComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencyTransformDirective, CurrencyTransformTestComponent],
      providers: [CurrencyPipe],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CurrencyTransformTestComponent);
        comp = fixture.componentInstance;
      });
  });
  it('test currency transform directive', () => {
    const input = fixture.debugElement.query(By.css('input'));
    const inputNative: HTMLInputElement = input.nativeElement;
    fixture.detectChanges();

    inputNative.value = 's1!2$3_1+2s3s';
    input.triggerEventHandler('input', { target: inputNative });
    fixture.detectChanges();
    expect(inputNative.value).toBe('123123');

    input.triggerEventHandler('change', { target: inputNative });
    fixture.detectChanges();
    expect(inputNative.value).toBe('₽123,123');
  });
});
