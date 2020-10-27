import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ConfigService } from '../../../config/config.service';
import { ConfigServiceStub } from '../../../config/config.service.stub';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { NavigationService } from '../../services/navigation/navigation.service';
import { ScreenContainerComponent } from '../screen-container/screen-container.component';
import { NavigationComponent } from './navigation.component';
import { DeviceDetectorService } from '../../services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../services/device-detector/device-detector.service.stub';


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
