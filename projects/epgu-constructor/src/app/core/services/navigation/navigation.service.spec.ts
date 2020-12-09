import { TestBed } from '@angular/core/testing';

import { NavigationService } from './navigation.service';
import { ConfigServiceStub } from '../../config/config.service.stub';
import { ConfigService } from '../../config/config.service';
import { DeviceDetectorService } from '../device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../device-detector/device-detector.service.stub';
import { SmuEventsService } from 'epgu-lib';
import { SmuEventsServiceStub } from '../device-detector/smu-events.service.stub';
import { MobilViewEvents } from '../../../shared/constants/redirect-event';

describe('NavigationService', () => {
  let navigationService: NavigationService;
  let deviceDetectorService: DeviceDetectorService;
  let configService: ConfigService;
  let smuEventsService: SmuEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: SmuEventsService, useClass: SmuEventsServiceStub },
      ],
    });
    delete window.location;
    window.location = { href: '' } as Location;
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    configService = TestBed.inject(ConfigService);
    smuEventsService = TestBed.inject(SmuEventsService);
    navigationService = TestBed.inject(NavigationService);
  });

  it('test skip', (done) => {
    navigationService.skipStep$.subscribe((v) => {
      expect(v).toBe(null);
      done();
    });
    navigationService.skip(null);
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
  it('test redirectToProfileEdit', () => {
    navigationService.isWebView = true;
    navigationService.redirectToProfileEdit();
    expect(window.location.href).toBe('/profile/user');
    navigationService.isWebView = false;
    navigationService.redirectToProfileEdit();
    expect(window.location.href).toBe(`${configService.lkUrl}/profile/personal`);
  });
  it('test redirectToLK', () => {
    navigationService.isWebView = false;
    navigationService.redirectToLK();
    expect(window.location.href).toBe(`${configService.lkUrl}/orders/all`);
    navigationService.isWebView = true;
    spyOn(smuEventsService, 'notify').and.callThrough();
    navigationService.redirectToLK();
    expect(smuEventsService.notify).toHaveBeenCalledWith(MobilViewEvents.feed);
  });
  it('test redirectToHome', () => {
    navigationService.isWebView = false;
    navigationService.redirectToHome();
    expect(window.location.href).toBe('/');
    navigationService.isWebView = true;
    spyOn(smuEventsService, 'notify').and.callThrough();
    navigationService.redirectToHome();
    expect(smuEventsService.notify).toHaveBeenCalledWith(MobilViewEvents.exit);
  });
});
