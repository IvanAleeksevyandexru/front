import { TestBed } from '@angular/core/testing';
import { System } from '@epgu/epgu-constructor-types';
import { CookieService } from '@epgu/ui/services/cookie';
import { LoadService } from '@epgu/ui/services/load';
import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { DeviceDetectorService } from './device-detector.service';
import { LoadServiceStub } from '../config/load-service-stub';
import { SmuEventsServiceStub } from './smu-events.service.stub';
import { WINDOW } from '../../providers/window.provider';
import { HelperService } from '@epgu/ui/services/helper';
import { MockProvider } from 'ng-mocks';

describe('DeviceDetectorService', () => {
  let deviceDetectorService: DeviceDetectorService;
  let injectableWindow: Window;
  let smuEventsService: SmuEventsService;
  let userAgent: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CookieService,
        DeviceDetectorService,
        MockProvider(HelperService),
        { provide: LoadService, useClass: LoadServiceStub },
        { provide: SmuEventsService, useClass: SmuEventsServiceStub },
        { provide: WINDOW, useValue: { navigator: {} } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    injectableWindow = TestBed.inject(WINDOW) as Window;
    smuEventsService = TestBed.inject(SmuEventsService);
    userAgent = jest.spyOn(window.navigator, 'userAgent', 'get');
  });

  it('is Mob', () => {
    injectableWindow.navigator['__defineGetter__'](
      'userAgent',
      () =>
        'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
    );
    deviceDetectorService.initState();
    expect(deviceDetectorService.isMobile).toBe(true);
  });

  it('is Tablet', () => {
    injectableWindow.navigator['__defineGetter__'](
      'userAgent',
      () =>
        'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    );
    deviceDetectorService.initState();
    expect(deviceDetectorService.isTablet).toBe(true);
  });

  it('is Desktop', () => {
    injectableWindow.navigator['__defineGetter__'](
      'userAgent',
      () =>
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
    );
    deviceDetectorService.initState();
    expect(deviceDetectorService.isDesktop).toBe(true);
  });

  it('is WebView', () => {
    smuEventsService.smuInit = true;
    deviceDetectorService.initState();
    expect(deviceDetectorService.isWebView).toBe(true);
  });

  it('is IOS', () => {
    userAgent.mockReturnValue(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8',
    );
    expect(deviceDetectorService.isIOS()).toBe(true);
  });

  it('is ChromeIOS', () => {
    injectableWindow.navigator['__defineGetter__'](
      'userAgent',
      () => 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75',
    );
    deviceDetectorService.initState();
    expect(deviceDetectorService.isChromeIOS()).toBe(true);
  });

  describe('get system', () => {
    it('should return "Desktop"', () => {
      deviceDetectorService.isDesktop = true;
      deviceDetectorService.initState();
      const operatingSystem = deviceDetectorService.system;
      expect(operatingSystem).toEqual(System.Desktop);
    });

    it('should return "Android"', () => {
      deviceDetectorService.isDesktop = false;
      injectableWindow.navigator['__defineGetter__']('userAgent', () => 'Android Mozilla');
      deviceDetectorService.initState();
      const operatingSystem = deviceDetectorService.system;
      expect(operatingSystem).toEqual(System.Android);
    });

    it('should return "iOS"', () => {
      deviceDetectorService.isDesktop = false;
      injectableWindow.navigator['__defineGetter__']('userAgent', () => 'iPhone Safari');
      deviceDetectorService.initState();
      const operatingSystem = deviceDetectorService.system;
      expect(operatingSystem).toEqual(System.iOS);
    });

    it('should return "Harmony"', () => {
      injectableWindow.navigator['__defineGetter__']('userAgent', () => 'Harmony');
      deviceDetectorService.initState();
      deviceDetectorService.isDesktop = false;
      const operatingSystem = deviceDetectorService.system;
      expect(operatingSystem).toEqual(System.Harmony);
    });

    it('should return "NotDetermined"', () => {
      injectableWindow.navigator['__defineGetter__']('userAgent', () => 'Ubuntu Touch');
      deviceDetectorService.initState();
      deviceDetectorService.isDesktop = false;
      const operatingSystem = deviceDetectorService.system;
      expect(operatingSystem).toEqual(System.NotDetermined);
    });

    it('should return "Error"', () => {
      injectableWindow.navigator['__defineGetter__']('userAgent', () => null);
      deviceDetectorService.initState();
      deviceDetectorService.isDesktop = false;
      const operatingSystem = deviceDetectorService.system;
      expect(operatingSystem).toEqual(System.Error);
    });
  });
});
