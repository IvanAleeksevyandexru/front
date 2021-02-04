import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ConfigService } from '../config/config.service';
import { ConfigServiceStub } from '../config/config.service.stub';
import { DatesToolsService } from '../dates-tools/dates-tools.service';
import { AutocompleteApiService } from './autocomplete-api.service';


describe('AutocompleteApiService', () => {
  let service: AutocompleteApiService;
  let http: HttpTestingController;
  let config: ConfigService;
  let apiUrl: string;
  let serviceId = '11111';
  let fields = ['CHILD_SNILS'];
  let groupId = 'PASSPORT_DATA';
  let responseMock = [42];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AutocompleteApiService,
        DatesToolsService,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ]
    });
    service = TestBed.inject(AutocompleteApiService);
    http = TestBed.inject(HttpTestingController);
    config = TestBed.inject(ConfigService);
    apiUrl = config.suggestionsApiUrl;
  }));

  afterEach(waitForAsync(() => http.verify()));

  describe('getSuggestionsGroup()', () => {
    let req;
    beforeEach(fakeAsync(() => {
      service.getSuggestionsGroup(groupId, serviceId).subscribe(response => expect(response).toBe(responseMock));
      req = http.expectOne(`${apiUrl}?groups=${groupId}&serviceId=${serviceId}`);
    }));

    afterEach(fakeAsync(() => {
      req.flush(responseMock);
      tick();
    }));

    it('should call http with get method', fakeAsync(() => {
      expect(req.request.method).toBe('GET');
    }));

    it('should call with groupId', fakeAsync(() => {
      const includesGroupdId = req.request.url.includes(groupId);
      expect(includesGroupdId).toBeTruthy();
    }));

    it('should call with serviceId', fakeAsync(() => {
      const includesServiceId = req.request.url.includes(serviceId);
      expect(includesServiceId).toBeTruthy();
    }));

    it('should call http get with withCredentials equal false', fakeAsync(() => {
      const withCredentials = req.request.withCredentials;
      expect(withCredentials).toBe(false);
    }));
  });

  describe('getSuggestionsFields()', () => {
    let req;
    beforeEach(fakeAsync(() => {
      service.getSuggestionsFields(fields, serviceId).subscribe(response => expect(response).toBe(responseMock));
      req = http.expectOne(`${apiUrl}?fields=${fields[0]}&serviceId=${serviceId}`);
    }));

    afterEach(fakeAsync(() => {
      req.flush(responseMock);
      tick();
    }));

    it('should call http with get method', fakeAsync(() => {
      expect(req.request.method).toBe('GET');
    }));

    it('should call with fields', fakeAsync(() => {
      const includesGroupdId = req.request.url.includes(fields[0]);
      expect(includesGroupdId).toBeTruthy();
    }));

    it('should call with serviceId', fakeAsync(() => {
      const includesServiceId = req.request.url.includes(serviceId);
      expect(includesServiceId).toBeTruthy();
    }));

    it('should call http get with withCredentials equal false', fakeAsync(() => {
      const withCredentials = req.request.withCredentials;
      expect(withCredentials).toBe(false);
    }));
  });
});
