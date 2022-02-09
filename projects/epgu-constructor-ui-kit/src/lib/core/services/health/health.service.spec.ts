import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventInfo, HealthService } from './health.service';
import { ActivatedRouteStub } from './activated-route.stub';
import { MockProvider } from 'ng-mocks';
import { HelperService } from '@epgu/ui/services/helper';
import { LoadService } from '@epgu/ui/services/load';
import { enableProdMode } from '@angular/core';

describe('HealthService', () => {
  let service: HealthService;
  let loadService: LoadService;
  let route: ActivatedRoute;
  let send: (event: string, time: number, result: number, eventInfo?: EventInfo) => void;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        LoadService,
        MockProvider(HelperService),
      ],
    });
    Date.now = () => 1;
    service = TestBed.inject(HealthService);
    loadService = TestBed.inject(LoadService);
    route = TestBed.inject(ActivatedRoute);
    send = service['send'];
  });
  afterEach(async () => {
    service['send'] = send;
  });

  it('should be measureStart', () => {
    service.measureStart('i');
    expect(service['measures']).toEqual({ i: 1 });
  });

  it('should be measureEnd', () => {
    service.measureStart('i');
    const fn = jest.fn();
    service['send'] = fn;
    service.measureEnd('i', 0, {});
    expect(fn).toHaveBeenCalledWith('i', 0, 0, {});
    expect(service['measures']).toEqual({});
  });

  it('should be measureDomEvents', () => {
    const fn = jest.fn();
    service['send'] = fn;
    const s = window.performance as any;
    s.timing = { domContentLoadedEventEnd: 2, navigationStart: 1, loadEventEnd: 1 };

    service.measureDomEvents('i');

    expect(fn).toHaveBeenCalledWith('i', 1, 0, {});
    expect(fn).toHaveBeenCalledWith('i', 0, 0, {});
    s.timing = null;
    service.measureDomEvents('i');
    expect(fn).toHaveBeenCalledWith('i', 0, 1, {});
  });

  it('should be measure', () => {
    const fn = jest.fn();
    service['send'] = fn;

    service.measure('i', 0);

    expect(fn).toHaveBeenCalledWith('i', 0, 0);
  });

  it('should be send', () => {
    const fn = jest.fn();
    HealthService['request'] = fn;
    loadService.config.timingApiUrl = 'http://test';
    const location = window.location as any;
    location.hash = '#test#test2';
    enableProdMode();
    Math.random = () => 0.01;
    service['send']('i', 3, 1, { test: 1 });

    expect(fn).toHaveBeenCalledWith(
      'http://test?_=0.01&pageId=_test_test2&event=i&timing=3&referrer=&result=1&test=1',
    );
  });
});
