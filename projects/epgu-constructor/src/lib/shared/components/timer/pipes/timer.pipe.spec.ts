import { TimerPipe } from './timer.pipe';
import { TestBed } from '@angular/core/testing';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';

describe('TimerPipe', () => {
  const pipe: TimerPipe = new TimerPipe(new DatesToolsService());

  TestBed.configureTestingModule({
    imports: [],
    providers: [
      DatesToolsService
    ],
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms time', () => {
    expect(pipe.transform(31985443)).toBe('08:53:05');
  });
});
