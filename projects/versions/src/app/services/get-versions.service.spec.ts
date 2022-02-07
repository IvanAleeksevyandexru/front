import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { GetVersionsService } from './get-versions.service';
import { ErrorService } from './error.service';

describe('GetVersionsService', () => {
  let service: GetVersionsService;
  let httpClient: HttpClient;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClient, GetVersionsService, ErrorService],
    });
    service = TestBed.inject(GetVersionsService);
    httpClient = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getLibVersions and return correct data', fakeAsync(() => {
    const url = 'sf-portal-st/assets/version.json';
    const responseMock = { version: 1 };
    service.getLibVersions(url).subscribe((response) => {
      expect(response.version).toBe(1);
    });
    const req = http.expectOne(url);
    req.flush(responseMock);
    tick();
  }));

  it('should call getServiceVersions and return correct data', fakeAsync(() => {
    const url = 'service-descriptor-storage/v1/scenario/version_gibdd';
    const responseMock = { version: 1 };
    service.getServiceVersions(url).subscribe((response) => {
      expect(response.version).toBe(1);
    });
    const req = http.expectOne(url);
    req.flush(responseMock);
    tick();
  }));
});
