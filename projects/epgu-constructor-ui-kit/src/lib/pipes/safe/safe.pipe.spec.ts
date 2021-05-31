import { SafePipe } from './safe.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { inject } from '@angular/core/testing';

describe('SafeUrlPipe', () => {
  let pipe: SafePipe;

  beforeEach(inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    pipe = new SafePipe(domSanitizer);
  }));

  it('check unknown type', () => {
    expect(() => pipe.transform('html', 'unknownType')).toThrowError('Invalid safe type specified');
  });
  it('check types', () => {
    expect(() => pipe.transform('html', 'html')).not.toThrowError('Invalid safe type specified');
    expect(() => pipe.transform('html', 'style')).not.toThrowError('Invalid safe type specified');
    expect(() => pipe.transform('html', 'script')).not.toThrowError('Invalid safe type specified');
    expect(() => pipe.transform('html', 'url')).not.toThrowError('Invalid safe type specified');
    expect(() => pipe.transform('html', 'resourceUrl')).not.toThrowError(
      'Invalid safe type specified',
    );
  });
});
