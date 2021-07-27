import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {
  ConfigService,
  ConfigServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { IdentificationApiService } from './identification-api.service';
import {
  PassportIdentificationRequestBody,
  SelfieIdentificationRequestBody,
  VideoIdentificationRequestBody
} from './identification-api.types';

describe('IdentificationApiService', () => {
  let service: IdentificationApiService;
  let http: HttpTestingController;
  let configService: ConfigService;
  let apiUrl: string;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        IdentificationApiService,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(IdentificationApiService);
    configService = TestBed.inject(ConfigService);
    http = TestBed.inject(HttpTestingController);
    apiUrl = configService.identificationApiUrl;
  });

  afterEach(waitForAsync(() => http.verify()));

  it('calling passportIdentification expectation', fakeAsync(() => {
    const responseMock = {};
    const requestBody = {} as PassportIdentificationRequestBody;
    service.passportIdentification(requestBody).subscribe((response) => expect(response).toBe(responseMock));
    const req = http.expectOne(`${apiUrl}/passport`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(requestBody);
    req.flush(responseMock);
    tick();
  }));

  it('calling selfieIdentification expectation', fakeAsync(() => {
    const responseMock = {};
    const requestBody = {} as SelfieIdentificationRequestBody;
    service.selfieIdentification(requestBody).subscribe((response) => expect(response).toBe(responseMock));
    const req = http.expectOne(`${apiUrl}/selfie`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(requestBody);
    req.flush(responseMock);
    tick();
  }));

  it('calling selfieIdentification expectation', fakeAsync(() => {
    const responseMock = {};
    const requestBody = {} as VideoIdentificationRequestBody;
    service.videoIdentification(requestBody).subscribe((response) => expect(response).toBe(responseMock));
    const req = http.expectOne(`${apiUrl}/video`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(requestBody);
    req.flush(responseMock);
    tick();
  }));
});
