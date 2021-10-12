import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { AutocompleteApiService } from './autocomplete-api.service';
import { configureTestSuite } from 'ng-bullet';

describe('AutocompleteApiService', () => {
  let service: AutocompleteApiService;
  let http: HttpTestingController;
  let config: ConfigService;
  let apiUrl: string;
  let fields = ['CHILD_SNILS'];
  let fieldId = 123456;
  let mnemonic = 'mnemonic';
  let newValue = 'newValue';
  let groupId = 'PASSPORT_DATA';
  let responseMock = [42];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AutocompleteApiService,
        DatesToolsService,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AutocompleteApiService);
    http = TestBed.inject(HttpTestingController);
    config = TestBed.inject(ConfigService);
    apiUrl = config.suggestionsApiUrl;
  });

  afterEach(waitForAsync(() => http.verify()));

  describe('getSuggestionsGroup()', () => {
    let req;
    beforeEach(fakeAsync(() => {
      service
        .getSuggestionsGroup(groupId)
        .subscribe((response) => expect(response).toBe(responseMock));
      req = http.expectOne(`${apiUrl}?groups=${groupId}`);
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

    it('should call http get with withCredentials equals false', fakeAsync(() => {
      const withCredentials = req.request.withCredentials;
      expect(withCredentials).toBe(true);
    }));
  });

  describe('getSuggestionsFields()', () => {
    let req;
    beforeEach(fakeAsync(() => {
      service
        .getSuggestionsFields(fields)
        .subscribe((response) => expect(response).toBe(responseMock));
      req = http.expectOne(`${apiUrl}?fields=${fields[0]}`);
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

    it('should call http get with withCredentials equals true', fakeAsync(() => {
      const withCredentials = req.request.withCredentials;
      expect(withCredentials).toBe(true);
    }));
  });

  describe('deleteSuggestionsField()', () => {
    let req;
    beforeEach(fakeAsync(() => {
      service
        .deleteSuggestionsField(fieldId)
        .subscribe((response) => expect(response).toBe(responseMock));
      req = http.expectOne(`${apiUrl}`);
    }));

    afterEach(fakeAsync(() => {
      req.flush(responseMock);
      tick();
    }));

    it('should call http with delete method', fakeAsync(() => {
      expect(req.request.method).toBe('DELETE');
    }));

    it('should call with body [fieldId]', fakeAsync(() => {
      const body = req.request.body;
      expect(body).toEqual([fieldId]);
    }));

    it('should call http delete with withCredentials equals true', fakeAsync(() => {
      const withCredentials = req.request.withCredentials;
      expect(withCredentials).toBe(true);
    }));
  });

  describe('updateSuggestionField()', () => {
    let req;
    beforeEach(fakeAsync(() => {
      service
        .updateSuggestionField(fieldId, mnemonic, newValue)
        .subscribe((response) => expect(response).toBe(responseMock));
      req = http.expectOne(`${apiUrl}/update`);
    }));

    afterEach(fakeAsync(() => {
      req.flush(responseMock);
      tick();
    }));

    it('should call http with post method', fakeAsync(() => {
      expect(req.request.method).toBe('POST');
    }));

    it('should call with non empty body', fakeAsync(() => {
      const includesBody = !!req.request.body.valueGroupId;
      expect(includesBody).toBeTruthy();
    }));

    it('should call http post with withCredentials equals true', fakeAsync(() => {
      const withCredentials = req.request.withCredentials;
      expect(withCredentials).toBe(true);
    }));
  });
});
