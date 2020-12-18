import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ConfigService } from '../../../core/config/config.service';
import { ConfigServiceStub } from '../../../core/config/config.service.stub';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { ScreenContainerComponent } from '../screen-container/screen-container.component';
import { NavigationComponent } from './navigation.component';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../core/services/device-detector/device-detector.service.stub';
import { WINDOW_PROVIDERS } from '../../../core/providers/window.provider';
import { LocationService } from '../../../core/services/location/location.service';


describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let ScreenContainerComponentMock = MockComponent(ScreenContainerComponent);
  let screenService: ScreenService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationComponent, ScreenContainerComponentMock ],
      providers: [
        NavigationService,
        LocationService,
        WINDOW_PROVIDERS,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    screenService = fixture.debugElement.injector.get(ScreenService);
    jest.spyOn(screenService, 'applicantAnswers', 'get').mockReturnValue({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
