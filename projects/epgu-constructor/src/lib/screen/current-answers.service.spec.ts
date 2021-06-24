import { TestBed } from '@angular/core/testing';

import { CurrentAnswersService } from './current-answers.service';
import { configureTestSuite } from 'ng-bullet';

describe('CurrentAnswersService', () => {
  let service: CurrentAnswersService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [CurrentAnswersService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(CurrentAnswersService);
  });

  it('should get and set state property', () => {
    expect(service.state).toBeUndefined();

    service.state = 'foo';
    expect(service.state).toBe('foo');

    service.state = 'bar';
    expect(service.state).toBe('bar');
  });

  it('should get and set isValid property', () => {
    expect(service.isValid).toBeNull();

    service.isValid = true;
    expect(service.isValid).toBe(true);

    service.isValid = false;
    expect(service.isValid).toBe(false);
  });
});
