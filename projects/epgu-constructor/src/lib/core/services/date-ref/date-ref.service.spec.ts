import { TestBed } from '@angular/core/testing';
import { DateRefService } from './date-ref.service';

describe('DateRefService', () => {
  let service: DateRefService;

  beforeEach(() => {
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
