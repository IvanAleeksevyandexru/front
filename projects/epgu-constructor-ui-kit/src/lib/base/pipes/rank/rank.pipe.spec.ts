import { RankPipe } from './rank.pipe';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { TestBed } from '@angular/core/testing';

registerLocaleData(localeRu, 'ru');

describe('RankPipe', () => {
  let pipe: RankPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'ru' }],
    });
    pipe = new RankPipe();
  });

  it('check types', () => {
    expect(pipe.transform('-')).toBe('-');
    expect(pipe.transform('1000')).toBe('1000');
    expect(pipe.transform('1000', true)).toBe('1\u00a0000');
    expect(pipe.transform('5555555', true)).toBe('5\u00a0555\u00a0555');
  });
});
