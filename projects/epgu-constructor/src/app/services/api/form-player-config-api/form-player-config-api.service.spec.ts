import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormPlayerConfigApiService } from './form-player-config-api.service';


describe('FormPlayerConfigApiService', () => {
  let service: FormPlayerConfigApiService;
  let http: HttpTestingController;
  let responseMock = [42];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FormPlayerConfigApiService,
      ]
    });
    service = TestBed.inject(FormPlayerConfigApiService);
    http = TestBed.inject(HttpTestingController);
  }));

  afterEach(waitForAsync(() => http.verify()));

  describe('getFormPlayerConfig()', () => {
    it('should call http with get method', fakeAsync(() => {
      service.getFormPlayerConfig().subscribe(response => expect(response).toBe(responseMock));
      const req = http.expectOne('/form-player-config');
      expect(req.request.method).toBe('GET');
      req.flush(responseMock);
      tick();
    }));
  });
});
