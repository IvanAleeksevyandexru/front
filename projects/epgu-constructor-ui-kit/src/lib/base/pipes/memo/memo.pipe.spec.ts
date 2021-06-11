import { TestBed } from '@angular/core/testing';
import { MemoPipe } from './memo.pipe';

describe('MemoPipe', () => {
  let pipe: MemoPipe;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    });
    pipe = new MemoPipe();
  });

  it('check pipe', () => {
    const context = {
      add: 'addedText',
    };
    const handler = function (value: string) {
      return `${this.add}${value}`;
    };
    expect(pipe.transform('Text', handler, context)).toBe('addedTextText');
  });
});
