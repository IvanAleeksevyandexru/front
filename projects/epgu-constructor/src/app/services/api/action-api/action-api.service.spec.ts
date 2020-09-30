import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ActionApiService } from './action-api.service';
import { ConfigService } from '../../../config/config.service';
import { ConfigServiceStub } from '../../../config/config.service.stub';

describe('ActionApiService', () => {
  let service: ActionApiService;
  let http: HttpTestingController;
  const apiUrl = '/api';
  const path = 'editPhoneNumber';
  const mockData = {};
  const responseMockData = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ConfigService, useClass: ConfigServiceStub }, ActionApiService],
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ActionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('send', fakeAsync(() => {
    service.send(path, mockData).subscribe((response) => expect(response).toBe(responseMockData));
    const req = http.expectOne(`${apiUrl}/${path}`);
    expect(req.request.method).toBe('POST');
    req.flush(responseMockData);
    tick();
  }));
});
