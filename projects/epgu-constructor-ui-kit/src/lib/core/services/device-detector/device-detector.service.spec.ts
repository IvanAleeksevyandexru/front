import { TestBed } from '@angular/core/testing';
import { DeviceDetectorService } from './device-detector.service';
import { configureTestSuite } from 'ng-bullet';
import { LoadServiceStub } from '../config/load-service-stub';
import { System } from './device-detector.types';
import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { CookieService } from '@epgu/ui/services/cookie';
import { LoadService } from '@epgu/ui/services/load';
import { WINDOW } from '../../providers/window.provider';

describe('DeviceDetectorService', () => {
  let deviceDetectorService: DeviceDetectorService;
  let injectableWindow: Window;
  let smuEventsService: SmuEventsService;
  let userAgent: jest.SpyInstance;
  let cookieService: CookieService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        DeviceDetectorService,
        { provide: LoadService, useClass: LoadServiceStub },
        { provide: WINDOW, useValue: { navigator: {}}},
        CookieService,
        CookieService,
        SmuEventsService,
      ],
    });
  });

  beforeEach(() => {
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    injectableWindow = TestBed.inject(WINDOW) as Window;
    smuEventsService = TestBed.inject(SmuEventsService);
    cookieService = TestBed.inject(CookieService);
    userAgent = jest.spyOn(window.navigator, 'userAgent', 'get');
  });

  it('is Mob', () => {
    // @ts-ignore
    injectableWindow.navigator.userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1';
    deviceDetectorService.initState();
    expect(deviceDetectorService.isMobile).toBe(true);
  });

  it('is Tablet', () => {
    // @ts-ignore
    injectableWindow.navigator.userAgent =
      'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
    deviceDetectorService.initState();
    expect(deviceDetectorService.isTablet).toBe(true);
  });

  it('is Desktop', () => {
    // @ts-ignore
    injectableWindow.navigator.userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36';
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

  describe('get system', () => {
    it('should return "Android"', () => {
      userAgent.mockReturnValue('Android Mozilla');

      const operatingSystem = deviceDetectorService.system;
      expect(operatingSystem).toEqual(System.Android);
    });

    it('should return "iOS"', () => {
      userAgent.mockReturnValue('iPhone Safari');

      const operatingSystem = deviceDetectorService.system;
      expect(operatingSystem).toEqual(System.iOS);
    });

    it('should return "Harmony"', () => {
      userAgent.mockReturnValue('Harmony Chrome');

      const operatingSystem = deviceDetectorService.system;
      expect(operatingSystem).toEqual(System.Harmony);
    });
  });
});
