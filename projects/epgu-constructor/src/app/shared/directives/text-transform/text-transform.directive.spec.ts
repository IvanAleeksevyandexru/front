import { TextTransformDirective } from './text-transform.directive';

import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TextTransform } from '../../types/textTransform';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyPipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';

@Component({
  selector: 'epgu-constructor-text-transform-test-component',
  template: `
    <input type="text" epgu-constructor-text-transform [textTransformType]="all" class="all" />
    <input type="text" epgu-constructor-text-transform [textTransformType]="first" class="first" />
    <input
      type="text"
      epgu-constructor-text-transform
      [textTransformType]="uppercase"
      class="uppercase"
    />
  `,
})
class TextTransformTestComponent {
  all: TextTransform = TextTransform.ALL;
  first: TextTransform = TextTransform.FIRST;
  uppercase: TextTransform = TextTransform.UPPERCASE;
}
describe('TextTransformDirective', () => {
  let fixture: ComponentFixture<TextTransformTestComponent>;
  let comp: TextTransformTestComponent;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TextTransformDirective, TextTransformTestComponent],
      providers: [CurrencyPipe],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextTransformTestComponent);
    comp = fixture.componentInstance;
  });

  it('test text transform uppercase', () => {
    const input = fixture.debugElement.query(By.css('.uppercase'));
    const inputNative: HTMLInputElement = input.nativeElement;
    fixture.detectChanges();

    inputNative.value = 'text';
    input.triggerEventHandler('input', { target: inputNative });
    fixture.detectChanges();
    expect(inputNative.value).toBe('TEXT');
  });

  it('test text transform first', () => {
    const input = fixture.debugElement.query(By.css('.first'));
    const inputNative: HTMLInputElement = input.nativeElement;
    fixture.detectChanges();

    inputNative.value = 'text';
    input.triggerEventHandler('input', { target: inputNative });
    fixture.detectChanges();
    expect(inputNative.value).toBe('Text');
  });

  it('test text transform all separator(space)', () => {
    const input = fixture.debugElement.query(By.css('.all'));
    const inputNative: HTMLInputElement = input.nativeElement;
    fixture.detectChanges();

    inputNative.value = 'text text   text text';
    input.triggerEventHandler('input', { target: inputNative });
    fixture.detectChanges();
    expect(inputNative.value).toBe('Text Text   Text Text');
  });

  it('test text transform all separator(-)', () => {
    const input = fixture.debugElement.query(By.css('.all'));
    const inputNative: HTMLInputElement = input.nativeElement;
    fixture.detectChanges();

    inputNative.value = '-text-text---text--text-';
    input.triggerEventHandler('input', { target: inputNative });
    fixture.detectChanges();
    expect(inputNative.value).toBe('-Text-Text---Text--Text-');
  });

  it('test text transform all separator(‐)', () => {
    const input = fixture.debugElement.query(By.css('.all'));
    const inputNative: HTMLInputElement = input.nativeElement;
    fixture.detectChanges();

    inputNative.value = '‐text‐text‐‐‐text‐‐text‐';
    input.triggerEventHandler('input', { target: inputNative });
    fixture.detectChanges();
    expect(inputNative.value).toBe('‐Text‐Text‐‐‐Text‐‐Text‐');
  });
});
