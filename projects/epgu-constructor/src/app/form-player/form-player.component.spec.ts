import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadService } from 'epgu-lib';
import { MockComponent } from 'ng-mocks';
import { LoadServiceStub } from '../core/config/load-service-stub';
import { FormPlayerComponent } from './form-player.component';
import { FormPlayerService } from './services/form-player/form-player.service';
import { FormPlayerServiceStub } from './services/form-player/form-player.service.stub';
import { UnsubscribeService } from '../core/services/unsubscribe/unsubscribe.service';
import { ModalContainerComponent } from '../modal/shared/modal-container/modal-container.component';
import { NavigationService } from '../core/services/navigation/navigation.service';
import { LoggerService } from '../core/services/logger/logger.service';
import { LoggerServiceStub } from '../core/services/logger/logger.service.stub';
import { ScreenResolverComponent } from '../screen/screen-resolver/screen-resolver.component';
import { ScreenModalComponent } from '../modal/screen-modal/screen-modal.component';
import { DeviceDetectorService } from '../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../core/services/device-detector/device-detector.service.stub';
import { ServiceDataService } from './services/service-data/service-data.service';
import { FormPlayerConfigApiService } from './services/form-player-config-api/form-player-config-api.service';
import { FormPlayerConfigApiServiceStub } from './services/form-player-config-api/form-player-config-api.service.stub';
import { NavigationServiceStub } from '../core/services/navigation/navigation.service.stub';
import { ConfigService } from '../core/config/config.service';
import { ConfigServiceStub } from '../core/config/config.service.stub';
import { ModalService } from '../modal/modal.service';
import { ModalServiceStub } from '../modal/modal.service.stub';
import { ScreenService } from '../screen/screen.service';
import { ScreenServiceStub } from '../screen/screen.service.stub';
import { EpguLibModuleInited } from '../core/core.module';


describe('FormPlayerComponent', () => {
  let formPlayerService: FormPlayerService;
  let ScreenResolverComponentMock = MockComponent(ScreenResolverComponent);
  let ScreenModalComponentMock = MockComponent(ScreenModalComponent);
  let ModalContainerComponentMock = MockComponent(ModalContainerComponent);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        EpguLibModuleInited,
      ],
      declarations: [
        FormPlayerComponent,
        ScreenResolverComponentMock,
        ModalContainerComponentMock,
        ScreenModalComponentMock,
      ],
      providers: [
        NavigationService,
        UnsubscribeService,
        ServiceDataService,
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: LoadService, useClass: LoadServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: FormPlayerConfigApiService, useClass: FormPlayerConfigApiServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ]
    }).compileComponents();
    formPlayerService = TestBed.inject(FormPlayerService);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(FormPlayerComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
