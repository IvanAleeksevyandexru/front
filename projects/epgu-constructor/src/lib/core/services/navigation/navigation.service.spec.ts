import { TestBed } from '@angular/core/testing';

import { NavigationService } from './navigation.service';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { SmuEventsService } from '@epgu/epgu-lib';
import { SmuEventsServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { MobilViewEvents } from '@epgu/epgu-constructor-ui-kit';
import { LocationService, WINDOW_PROVIDERS } from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { OrgType } from '@epgu/epgu-constructor-types';

describe('NavigationService', () => {
  let navigationService: NavigationService;
  let deviceDetectorService: DeviceDetectorService;
  let configService: ConfigService;
  let smuEventsService: SmuEventsService;
  let locationService: LocationService;
  let screenService: ScreenService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        LocationService,
        WINDOW_PROVIDERS,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: SmuEventsService, useClass: SmuEventsServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    });
  });

  beforeEach(() => {
    delete window.location;
    window.location = { href: '' } as Location;
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    configService = TestBed.inject(ConfigService);
    smuEventsService = TestBed.inject(SmuEventsService);
    navigationService = TestBed.inject(NavigationService);
    locationService = TestBed.inject(LocationService);
    screenService = TestBed.inject(ScreenService);
  });

  it('test skip', (done) => {
    navigationService.skipStep$.subscribe((v) => {
      expect(v).toBe(null);
      done();
    });
    navigationService.skip(null);
  });

  it('test restart', (done) => {
    navigationService.restartOrder$.subscribe((v) => {
      expect(v).toBe(null);
      done();
    });
    navigationService.restartOrder(null);
  });

  it('test next', (done) => {
    navigationService.nextStep$.subscribe((v) => {
      expect(v).toBe(null);
      done();
    });
    navigationService.next(null);
  });

  it('test prev', (done) => {
    navigationService.prevStep$.subscribe((v) => {
      expect(v).toBe(null);
      done();
    });
    navigationService.prev(null);
  });
  it('test patch', (done) => {
    navigationService.patchStepOnCli$.subscribe((v) => {
      expect(v).toBe(null);
      done();
    });
    navigationService.patchOnCli(null);
  });
  it('redirectTo()', () => {
    const hrefFn = jest.spyOn(locationService, 'href');
    navigationService.redirectTo('/abc');
    expect(hrefFn).toBeCalledTimes(1);
    expect(hrefFn).toBeCalledWith('/abc');
  });
  it('test redirectToProfileEdit', () => {
    navigationService.redirectToProfileEdit();
    expect(locationService.getHref()).toBe(`${configService.lkUrl}/settings/edit`);
  });
  it('test redirectToLK', () => {
    navigationService.isWebView = false;
    navigationService.redirectToLK();
    expect(locationService.getHref()).toBe(`${configService.lkUrl}/orders/all`);
    navigationService.isWebView = true;
    spyOn(smuEventsService, 'notify').and.callThrough();
    navigationService.redirectToLK();
    expect(locationService.getHref()).toBe(`${configService.lkUrl}/notifications`);
  });
  it('test redirectToLKByOrgType', () => {
    spyOn(navigationService, 'redirectToLK').and.callThrough();
    screenService.initScreenStore({ additionalParameters: {}});
    navigationService.redirectToLKByOrgType();
    expect(navigationService.redirectToLK).toHaveBeenCalledWith(false);
    expect(locationService.getHref()).toBe(`${configService.lkUrl}/orders/all`);
    screenService.initScreenStore({ additionalParameters: { orgType: OrgType.Legal }});
    spyOn(smuEventsService, 'notify').and.callThrough();
    navigationService.redirectToLKByOrgType();
    expect(navigationService.redirectToLK).toHaveBeenCalledWith(true);
    expect(locationService.getHref()).toBe(`${configService.lkUrl}/notifications`);
  });
  it('test redirectToHome', () => {
    navigationService.isWebView = false;
    navigationService.redirectToHome();
    expect(locationService.getHref()).toBe('/');
    navigationService.isWebView = true;
    spyOn(smuEventsService, 'notify').and.callThrough();
    navigationService.redirectToHome();
    expect(smuEventsService.notify).toHaveBeenCalledWith(MobilViewEvents.exit);
  });
  it('test redirectExternal', () => {
    const url = '#';

    spyOn(window, 'open').and.callFake((url: string, target: string) => {
      // do nothing
    });
    navigationService.redirectExternal(url);
    expect(window.open).toHaveBeenCalledWith(url, '_blank');
  });
});
