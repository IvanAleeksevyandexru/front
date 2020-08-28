import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { CarInfoAccidentsPipe } from './car-accidents.pipe';

describe('CarInfoAccidentsPipe', () => {
  let pipe: CarInfoAccidentsPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
        provide: DomSanitizer,
        useValue: {
          bypassSecurityTrustHtml: (val: string) => val
        }
      }]
    });
  });

  it('create an instance', () => {
    const service: DomSanitizer = TestBed.get(DomSanitizer);
    pipe = new CarInfoAccidentsPipe(service);
    expect(pipe).toBeTruthy();
  });

  it('transforms "0" to "В ГИБДД нет данных об авариях"', () => {
    expect(pipe.transform(0)).toBe('В ГИБДД нет данных об авариях');
  });

  it('transforms "1" to "В ГИБДД есть данные об авариях: <span style="font-weight:bold;">1 ДТП</span>"', () => {
    expect(pipe.transform(1)).toBe('В ГИБДД есть данные об авариях: <span style="font-weight:bold;">1 ДТП</span>');
  });
});
