import { TextTransformDirective } from './text-transform.directive';

import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyPipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, NgControl } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { BaseModule } from '@epgu/epgu-constructor/src/lib/shared/base.module';
import { TextTransform } from '@epgu/epgu-constructor-types';
import { TextTransformService } from '../../../core/services/text-transform/text-transform.service';

@Component({
  selector: 'epgu-cf-ui-constructor-text-transform-test-component',
  template: `
    <div [formGroup]="form">
      <input
        epgu-cf-ui-constructor-text-transform
        class="all"
        type="text"
        formControlName="all"
        [textTransformType]="all"
      />
      <input
        epgu-cf-ui-constructor-text-transform
        class="first"
        type="text"
        formControlName="first"
        [textTransformType]="first"
      />
      <input
        epgu-cf-ui-constructor-text-transform
        class="uppercase"
        type="text"
        formControlName="uppercase"
        [textTransformType]="uppercase"
      />
    </div>
  `,
})
class TextTransformTestComponent {
  all: TextTransform = TextTransform.ALL;
  first: TextTransform = TextTransform.FIRST;
  uppercase: TextTransform = TextTransform.UPPERCASE;

  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      all: new FormControl({ value: '' }),
      first: new FormControl({ value: '' }),
      uppercase: new FormControl({ value: '' }),
    });
  }
}
describe('TextTransformDirective', () => {
  let component: TextTransformTestComponent;
  let fixture: ComponentFixture<TextTransformTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TextTransformDirective, TextTransformTestComponent],
      imports: [BaseModule],
      providers: [CurrencyPipe, NgControl, TextTransformService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextTransformTestComponent);
    component = fixture.componentInstance;
  });

  it('test text transform uppercase', () => {
    const input = fixture.debugElement.query(By.css('.uppercase'));
    const inputNative: HTMLInputElement = input.nativeElement;
    const control = component.form.get('uppercase');
    fixture.detectChanges();

    inputNative.value = 'text';
    input.triggerEventHandler('input', { target: inputNative });
    fixture.detectChanges();
    expect(inputNative.value).toBe('TEXT');
    expect(control.value).toBe('TEXT');
  });

  it('test text transform first', () => {
    const input = fixture.debugElement.query(By.css('.first'));
    const inputNative: HTMLInputElement = input.nativeElement;
    const control = component.form.get('first');
    fixture.detectChanges();

    inputNative.value = 'text';
    input.triggerEventHandler('input', { target: inputNative });
    fixture.detectChanges();
    expect(inputNative.value).toBe('Text');
    expect(control.value).toBe('Text');
  });

  it('test text transform all separator(space)', () => {
    const input = fixture.debugElement.query(By.css('.all'));
    const inputNative: HTMLInputElement = input.nativeElement;
    const control = component.form.get('all');
    fixture.detectChanges();

    inputNative.value = 'text text   text text';
    input.triggerEventHandler('input', { target: inputNative });
    fixture.detectChanges();
    expect(inputNative.value).toBe('Text Text   Text Text');
    expect(control.value).toBe('Text Text   Text Text');
  });

  it('test text transform all separator(-)', () => {
    const input = fixture.debugElement.query(By.css('.all'));
    const inputNative: HTMLInputElement = input.nativeElement;
    const control = component.form.get('all');
    fixture.detectChanges();

    inputNative.value = '-text-text---text--text-';
    input.triggerEventHandler('input', { target: inputNative });
    fixture.detectChanges();
    expect(inputNative.value).toBe('-Text-Text---Text--Text-');
    expect(control.value).toBe('-Text-Text---Text--Text-');
  });

  it('test text transform all separator(‐)', () => {
    const input = fixture.debugElement.query(By.css('.all'));
    const inputNative: HTMLInputElement = input.nativeElement;
    const control = component.form.get('all');
    fixture.detectChanges();

    inputNative.value = '‐text‐text‐‐‐text‐‐text‐';
    input.triggerEventHandler('input', { target: inputNative });
    fixture.detectChanges();
    expect(inputNative.value).toBe('‐Text‐Text‐‐‐Text‐‐Text‐');
    expect(control.value).toBe('‐Text‐Text‐‐‐Text‐‐Text‐');
  });
});
