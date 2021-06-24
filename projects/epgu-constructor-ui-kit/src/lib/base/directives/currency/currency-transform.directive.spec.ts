import { CurrencyTransformDirective } from './currency-transform.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormControl, NgControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseUiModule } from '../../base-ui.module';

@Component({
  selector: 'epgu-cf-ui-currency-transform-test-component',
  template: `
    <input
      type="text"
      [epgu-cf-ui-currency-transform]="true"
      [formControl]="control"
    />`,
})
class CurrencyTransformTestComponent {
  control =  new FormControl('');
}

describe('CurrencyTransformDirective', () => {
  let fixture: ComponentFixture<CurrencyTransformTestComponent>;
  let comp: CurrencyTransformTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencyTransformTestComponent],
      imports: [RouterTestingModule, BaseUiModule],
      providers: [CurrencyPipe, NgControl],
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
    expect(inputNative.value).toBe('123\u00a0123\u00a0₽');
  });
});
