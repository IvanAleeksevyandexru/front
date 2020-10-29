import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonComponent, LoaderComponent } from 'epgu-lib';
import { ConfigService } from 'projects/epgu-constructor/src/app/core/config/config.service';
import { ConfigServiceStub } from 'projects/epgu-constructor/src/app/core/config/config.service.stub';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { PageNameComponent } from '../../../../../shared/components/base/page-name/page-name.component';
import { NavigationComponent } from '../../../../../shared/components/navigation/navigation.component';
import { ScreenContainerComponent } from '../../../../../shared/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../../../../shared/components/screen-pad/screen-pad.component';
import { NavigationService } from '../../../../../core/services/navigation/navigation.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { ConfirmInfoInterface } from '../models/confirm-info.interface';
import { TimerPipe } from '../pipes/timer.pipe';
import { ConfirmComponent } from './confirm.component';
import { TimerComponent } from './timer/timer.component';
import { DeviceDetectorService } from '../../../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../../core/services/device-detector/device-detector.service.stub';


describe('ConfirmMarriageComponent', () => {
  let component: ConfirmComponent;
  let fixture: ComponentFixture<ConfirmComponent>;
  let navigationService: NavigationService;
  let screenService: ScreenService;

  const mockComponentValue: ConfirmInfoInterface = {
    place: '',
    time: '',
    ceremonyType: '',
    address: '',
    timer: {
      start: '',
      finish: '',
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      imports: [RouterTestingModule],
      declarations: [
        ConfirmComponent,
        ButtonComponent,
        TimerComponent,
        TimerPipe,
        ScreenContainerComponent,
        PageNameComponent,
        ScreenPadComponent,
        NavigationComponent,
        LoaderComponent,
      ],
      providers: [
        UnsubscribeService,
        NavigationService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ],
    }).compileComponents();

    navigationService = TestBed.inject(NavigationService);
    screenService = TestBed.inject(ScreenService);
    jest.spyOn(screenService, 'componentValue', 'get').mockReturnValue(mockComponentValue);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
