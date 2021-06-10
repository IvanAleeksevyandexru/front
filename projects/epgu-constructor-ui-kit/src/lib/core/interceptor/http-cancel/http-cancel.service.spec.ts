import { TestBed } from '@angular/core/testing';
import { HttpCancelService } from './http-cancel.service';


describe('HttpCancelService', () => {
  let service: HttpCancelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpCancelService]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(HttpCancelService);
  });

  it('onCancelPendingRequests() should emit if call cancelPendingRequests()', (done) => {
    service.onCancelPendingRequests().subscribe(res => {
      expect(res).toBeUndefined();
      done();
    });
    service.cancelPendingRequests();
  });
});
