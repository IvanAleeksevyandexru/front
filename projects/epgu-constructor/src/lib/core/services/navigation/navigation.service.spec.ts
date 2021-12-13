import { TestBed } from '@angular/core/testing';
import {
  ConfigService,
  ConfigServiceStub,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  LocationService,
  MobilViewEvents,
  SmuEventsServiceStub,
  WINDOW_PROVIDERS,
} from '@epgu/epgu-constructor-ui-kit';
import {
  ActionType,
  ComponentActionDto,
  DTOActionAction,
  OrgType,
} from '@epgu/epgu-constructor-types';
import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { NavigationService } from './navigation.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';

describe('NavigationService', () => {
  let navigationService: NavigationService;
  let deviceDetectorService: DeviceDetectorService;
  let configService: ConfigService;
  let smuEventsService: SmuEventsService;
  let locationService: LocationService;
  let screenService: ScreenService;

  const mockAction: ComponentActionDto = {
    label: 'В личный кабинет',
    value: 'В личный кабинет',
    type: ActionType.redirectToLK,
    action: DTOActionAction.getNextStep,
  };

  const mockQueryParams: Pick<ComponentActionDto, 'queryParams'> = {
    queryParams: {
      type: 'EQUEUE',
    },
  };

  const mockActionWithQueryParams: ComponentActionDto = {
    ...mockAction,
    ...mockQueryParams,
  };

  beforeEach(() => {
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

  it('test saveCache', (done) => {
    navigationService.saveCacheToDraft$.subscribe((v) => {
      expect(v).toBe(null);
      done();
    });
    navigationService.saveCache(null);
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
    navigationService.isWebView = false;
    navigationService.redirectToProfileEdit();
    expect(locationService.getHref()).toBe(`${configService.lkUrl}/settings/edit`);
    navigationService.isWebView = true;
    const spy = jest.spyOn(smuEventsService, 'notify');
    navigationService.redirectToProfileEdit();
    expect(spy).toHaveBeenCalledWith(MobilViewEvents.profile);
  });
  it('test redirectToLK', () => {
    navigationService.isWebView = false;
    navigationService.redirectToLK();
    expect(locationService.getHref()).toBe(`${configService.lkUrl}/orders/all`);
    navigationService.redirectToLK(false, mockActionWithQueryParams);
    expect(locationService.getHref()).toBe(
      `${configService.lkUrl}/orders?${Object.keys(mockActionWithQueryParams.queryParams)[0]}=${
        Object.values(mockActionWithQueryParams.queryParams)[0]
      }`,
    );

    navigationService.isWebView = true;
    jest.spyOn(smuEventsService, 'notify');
    navigationService.redirectToLK();
    expect(locationService.getHref()).toBe(`${configService.lkUrl}/notifications`);
    navigationService.redirectToLK(false, mockActionWithQueryParams);
    expect(locationService.getHref()).toBe(
      `${configService.lkUrl}/notifications?${
        Object.keys(mockActionWithQueryParams.queryParams)[0]
      }=${Object.values(mockActionWithQueryParams.queryParams)[0]}`,
    );
  });
  it('test redirectToLKByOrgType', () => {
    const spy = jest.spyOn(navigationService, 'redirectToLK');
    screenService.initScreenStore({ additionalParameters: {} });
    navigationService.redirectToLKByOrgType(mockAction);
    expect(spy).toHaveBeenCalledWith(false, mockAction);
    expect(locationService.getHref()).toBe(`${configService.lkUrl}/orders/all`);
    screenService.initScreenStore({ additionalParameters: {} });
    navigationService.redirectToLKByOrgType({ ...mockAction, ...mockQueryParams });
    expect(navigationService.redirectToLK).toHaveBeenCalledWith(false, mockAction);
    expect(locationService.getHref()).toBe(
      `${configService.lkUrl}/orders?${Object.keys(mockQueryParams.queryParams)[0]}=${
        Object.values(mockQueryParams.queryParams)[0]
      }`,
    );
    screenService.initScreenStore({ additionalParameters: { orgType: OrgType.Legal } });
    jest.spyOn(smuEventsService, 'notify');
    navigationService.redirectToLKByOrgType(mockAction);
    expect(navigationService.redirectToLK).toHaveBeenCalledWith(true, mockAction);
    expect(locationService.getHref()).toBe(`${configService.lkUrl}/notifications`);
  });
  it('test redirectToHome', () => {
    navigationService.isWebView = false;
    navigationService.redirectToHome();
    expect(locationService.getHref()).toBe('/');
    navigationService.isWebView = true;
    const spy = jest.spyOn(smuEventsService, 'notify');
    navigationService.redirectToHome();
    expect(spy).toHaveBeenCalledWith(MobilViewEvents.exit);
  });
  it('test redirectExternal', () => {
    const url = '#';

    // @ts-ignore
    // eslint-disable-next-line no-empty-function
    jest.spyOn(window, 'open').mockImplementation((urlParam: string, target: string): Window => {});
    navigationService.redirectExternal(url);
    expect(window.open).toHaveBeenCalledWith(url, '_blank');
  });
});
