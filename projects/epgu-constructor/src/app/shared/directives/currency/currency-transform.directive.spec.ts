import { CurrencyTransformDirective } from './currency-transform.directive';
import { TestBed } from '@angular/core/testing';
import { CurrencyPipe } from '@angular/common';

describe('CurrencyTransformDirective', () => {
  let currencyPipe: CurrencyPipe;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrencyPipe]
    });
  });
  it('should create an instance', () => {
    const directive = new CurrencyTransformDirective(currencyPipe);
    expect(directive).toBeTruthy();
  });
});
