import { TestBed } from '@angular/core/testing';
import { ScreenModalService } from './screen-modal.service';


describe('ScreenModalService', () => {
  let service: ScreenModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScreenModalService],
    });
    service = TestBed.inject(ScreenModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
