import { TestBed } from '@angular/core/testing';
import { CookieService, LoadService, SmuEventsService } from '@epgu/epgu-lib';
import { LoadServiceStub } from '../config/load-service-stub';
import { DeviceDetectorService } from './device-detector.service';
import { configureTestSuite } from 'ng-bullet';

describe('DeviceDetectorService', () => {
  let deviceDetectorService: DeviceDetectorService;
  let loadService: LoadServiceStub;
  let smuEventsService: SmuEventsService;
  let userAgent: jest.SpyInstance;
  let cookieService: CookieService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        DeviceDetectorService,
        { provide: LoadService, useClass: LoadServiceStub },
        CookieService,
        SmuEventsService,
      ],
    });
  });

  beforeEach(() => {
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    loadService = TestBed.inject(LoadService);
    smuEventsService = TestBed.inject(SmuEventsService);
    cookieService = TestBed.inject(CookieService);
    userAgent = jest.spyOn(window.navigator, 'userAgent', 'get');
  });

  it('is Mob', () => {
    loadService.attributes = { deviceType: 'mob' };
    deviceDetectorService.initState();
    expect(deviceDetectorService.isMobile).toBe(true);
  });

  it('is Tablet', () => {
    loadService.attributes = { deviceType: 'tab' };
    deviceDetectorService.initState();
    expect(deviceDetectorService.isTablet).toBe(true);
  });

  it('is Desktop', () => {
    loadService.attributes = { deviceType: 'desk' };
    deviceDetectorService.initState();
    expect(deviceDetectorService.isDesktop).toBe(true);
  });

  it('is WebView', () => {
    smuEventsService.smuInit = true;
    deviceDetectorService.initState();
    expect(deviceDetectorService.isWebView).toBe(true);
  });

  it('is ChromeIOS', () => {
    userAgent.mockReturnValue('AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75');
    expect(deviceDetectorService.isChromeIOS()).toBe(true);
  });
});
