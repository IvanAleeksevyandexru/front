import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { GetVersionsService } from './get-versions.service';
import {
  LIB_VERSIONS_DEV_01_URL,
  LIB_VERSIONS_DEV_02_URL,
  LIB_VERSIONS_DEV_L11_URL,
  LIB_VERSIONS_PROD_LIKE_URL,
  LIB_VERSIONS_PROD_URL,
  LIB_VERSIONS_UAT2_URL,
  LIB_VERSIONS_UAT_URL,
  SERVICE_VERSIONS_DEV_01_URL,
  SERVICE_VERSIONS_DEV_02_URL,
  SERVICE_VERSIONS_DEV_L11_URL,
  SERVICE_VERSIONS_PROD_LIKE_URL,
  SERVICE_VERSIONS_UAT_URL,
} from '../shared/constants';

describe('GetVersionsService', () => {
  let service: GetVersionsService;
  let httpClient: HttpClient;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClient, GetVersionsService],
    });
    service = TestBed.inject(GetVersionsService);
    httpClient = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getLibVersionsFromUat and return correct data', fakeAsync(() => {
    const responseMock = { version: 1 };
    service.getLibVersionsFromUat().subscribe((response) => {
      expect(response.version).toBe(1);
    });
    const req = http.expectOne(`${LIB_VERSIONS_UAT_URL}`);
    req.flush(responseMock);
    tick();
  }));

  it('should call getServiceVersionsFromUat and return correct data', fakeAsync(() => {
    const responseMock = { version: 1 };
    service.getServiceVersionsFromUat().subscribe((response) => {
      expect(response.version).toBe(1);
    });
    const req = http.expectOne(`${SERVICE_VERSIONS_UAT_URL}`);
    req.flush(responseMock);
    tick();
  }));

  it('should call getLibVersionsFromUat2 and return correct data', fakeAsync(() => {
    const responseMock = { version: 1 };
    service.getLibVersionsFromUat2().subscribe((response) => {
      expect(response.version).toBe(1);
    });
    const req = http.expectOne(`${LIB_VERSIONS_UAT2_URL}`);
    req.flush(responseMock);
    tick();
  }));

  it('should call getLibVersionsFromDevL11 and return correct data', fakeAsync(() => {
    const responseMock = { version: 1 };
    service.getLibVersionsFromDevL11().subscribe((response) => {
      expect(response.version).toBe(1);
    });
    const req = http.expectOne(`${LIB_VERSIONS_DEV_L11_URL}`);
    req.flush(responseMock);
    tick();
  }));

  it('should call getServiceVersionsFromDevL11 and return correct data', fakeAsync(() => {
    const responseMock = { version: 1 };
    service.getServiceVersionsFromDevL11().subscribe((response) => {
      expect(response.version).toBe(1);
    });
    const req = http.expectOne(`${SERVICE_VERSIONS_DEV_L11_URL}`);
    req.flush(responseMock);
    tick();
  }));

  it('should call getLibVersionsFromDev02 and return correct data', fakeAsync(() => {
    const responseMock = { version: 1 };
    service.getLibVersionsFromDev02().subscribe((response) => {
      expect(response.version).toBe(1);
    });
    const req = http.expectOne(`${LIB_VERSIONS_DEV_02_URL}`);
    req.flush(responseMock);
    tick();
  }));

  it('should call getServiceVersionsFromDev02 and return correct data', fakeAsync(() => {
    const responseMock = { version: 1 };
    service.getServiceVersionsFromDev02().subscribe((response) => {
      expect(response.version).toBe(1);
    });
    const req = http.expectOne(`${SERVICE_VERSIONS_DEV_02_URL}`);
    req.flush(responseMock);
    tick();
  }));

  it('should call getLibVersionsFromDev01 and return correct data', fakeAsync(() => {
    const responseMock = { version: 1 };
    service.getLibVersionsFromDev01().subscribe((response) => {
      expect(response.version).toBe(1);
    });
    const req = http.expectOne(`${LIB_VERSIONS_DEV_01_URL}`);
    req.flush(responseMock);
    tick();
  }));

  it('should call getServiceVersionsFromDev01 and return correct data', fakeAsync(() => {
    const responseMock = { version: 1 };
    service.getServiceVersionsFromDev01().subscribe((response) => {
      expect(response.version).toBe(1);
    });
    const req = http.expectOne(`${SERVICE_VERSIONS_DEV_01_URL}`);
    req.flush(responseMock);
    tick();
  }));

  it('should call getLibVersionsFromProd and return correct data', fakeAsync(() => {
    const responseMock = { version: 1 };
    service.getLibVersionsFromProd().subscribe((response) => {
      expect(response.version).toBe(1);
    });
    const req = http.expectOne(`${LIB_VERSIONS_PROD_URL}`);
    req.flush(responseMock);
    tick();
  }));

  it('should call getLibVersionsFromProdLike and return correct data', fakeAsync(() => {
    const responseMock = { version: 1 };
    service.getLibVersionsFromProdLike().subscribe((response) => {
      expect(response.version).toBe(1);
    });
    const req = http.expectOne(`${LIB_VERSIONS_PROD_LIKE_URL}`);
    req.flush(responseMock);
    tick();
  }));

  it('should call getLibVersionsFromUat and return correct data', fakeAsync(() => {
    const responseMock = { version: 1 };
    service.getServiceVersionsFromProdLike().subscribe((response) => {
      expect(response.version).toBe(1);
    });
    const req = http.expectOne(`${SERVICE_VERSIONS_PROD_LIKE_URL}`);
    req.flush(responseMock);
    tick();
  }));
});
