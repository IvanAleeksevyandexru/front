import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { NavigationComponent } from './navigation.component';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { LocationService, WINDOW_PROVIDERS } from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let screenService: ScreenService;
  let navService: NavigationService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      providers: [
        NavigationService,
        LocationService,
        WINDOW_PROVIDERS,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    navService = TestBed.inject(NavigationService);
    screenService = TestBed.inject(ScreenService);
    jest.spyOn(screenService, 'display', 'get').mockReturnValue({ firstScreen: true } as any);
    fixture.detectChanges();
  });

  describe('handleKeyEvent', () => {
    it('should be call redirectToHome if it is first screen', () => {
      jest.spyOn(navService, 'redirectToHome');
      component.clickGoBack();
      expect(navService.redirectToHome).toHaveBeenCalledWith();
    });

    it('should be call prev if it is first screen', () => {
      jest.spyOn(screenService, 'display', 'get').mockReturnValue({ firstScreen: false } as any);
      jest.spyOn(navService, 'prev');
      component.clickGoBack();
      expect(navService.prev).toHaveBeenCalledWith();
    });
  });

  describe('handleKeyEvent', () => {
    it('should be call clickGoBack after enter press', () => {
      const event = {
        code: 'Enter',
        // eslint-disable-next-line no-empty-function
        preventDefault: () => {},
      };
      jest.spyOn(component, 'clickGoBack');
      component.handleKeyEvent(event as any);
      expect(component.clickGoBack).toHaveBeenCalledWith();
    });

    it('should be call clickGoBack after space press', () => {
      const event = {
        code: 'Space',
        // eslint-disable-next-line no-empty-function
        preventDefault: () => {},
      };
      jest.spyOn(component, 'clickGoBack');
      component.handleKeyEvent(event as any);
      expect(component.clickGoBack).toHaveBeenCalledWith();
    });
  });
});