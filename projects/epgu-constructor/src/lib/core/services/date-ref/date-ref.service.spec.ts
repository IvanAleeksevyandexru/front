import { configureTestSuite } from 'ng-bullet';
import { TestBed } from '@angular/core/testing';
import { DateRefService } from './date-ref.service';

describe('DateRefService', () => {
  let service: DateRefService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [DateRefService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DateRefService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
