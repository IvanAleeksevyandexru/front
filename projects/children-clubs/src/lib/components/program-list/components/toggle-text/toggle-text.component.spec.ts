import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WINDOW, WINDOW_PROVIDERS } from '@epgu/epgu-constructor-ui-kit';

import { ToggleTextComponent } from './toggle-text.component';

const lineHeight = 24;

class MockElementRef implements ElementRef {
  nativeElement = {
    get offsetHeight(): number {
      let wordsQnt = this.innerText.split(' ').length;
      //ширина строки равна 3м словам
      let linesQnt = Math.ceil(wordsQnt / 3);
      return linesQnt * lineHeight;
    },
    appendChild: () => null,
    removeChild: () => null,
    cloneNode() {
      return this;
    },
    innerText: '',
  };
}

describe('ToggleTextComponent', () => {
  let component: ToggleTextComponent;
  let fixture: ComponentFixture<ToggleTextComponent>;
  let window: Window;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToggleTextComponent],
      providers: [WINDOW_PROVIDERS],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    window = TestBed.inject(WINDOW) as Window;
    component['elemRef'] = new MockElementRef();

    jest.spyOn(window, 'getComputedStyle').mockReturnValue(({
      getPropertyValue: () => '' + lineHeight, // mock line-height
    } as unknown) as CSSStyleDeclaration);
  });

  it('should show all text if text length < linesQuantity', () => {
    component.text = 'text text2 text3';
    component.linesQuantity = 2;

    component.ngOnChanges();
    fixture.detectChanges();

    const resultText = fixture.debugElement.query(By.css('.toggle-text')).nativeElement.textContent;
    expect(resultText).toBe('text text2 text3');
  });

  it('should cut text if text length > linesQuantity = 1', () => {
    component.text = 'text text2 text3 text4 text5 text6';
    component.linesQuantity = 1;

    component.ngOnChanges();
    fixture.detectChanges();

    const resultText = fixture.debugElement
      .query(By.css('.toggle-text'))
      .nativeElement.textContent.trim();
    expect(resultText).toBe('text text2 [...]');
  });

  it('should cut text if text length > linesQuantity = 2', () => {
    component.text = 'text text2 text3 text4 text5 text6';
    component.linesQuantity = 2;

    component.ngOnChanges();
    fixture.detectChanges();

    const resultText = fixture.debugElement
      .query(By.css('.toggle-text'))
      .nativeElement.textContent.trim();
    expect(resultText).toBe('text text2 text3 text4 text5 [...]');
  });

  describe('toggleText()', () => {
    it('should toggle text', () => {
      component.showAllText = true;

      component.toggleText();

      expect(component.showAllText).toBeFalsy();
    });

    it('should toggle text', () => {
      component.showAllText = false;

      component.toggleText();

      expect(component.showAllText).toBeTruthy();
    });
  });
});
