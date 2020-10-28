import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonComponent, LoaderComponent } from 'epgu-lib';
import { ConfigService } from 'projects/epgu-constructor/src/app/config/config.service';
import { ConfigServiceStub } from 'projects/epgu-constructor/src/app/config/config.service.stub';
import { UnsubscribeService } from '../../../../../shared/services/unsubscribe/unsubscribe.service';
import { PageNameComponent } from '../../../../../shared/components/base/page-name/page-name.component';
import { NavigationComponent } from '../../../../../shared/components/navigation/navigation.component';
import { ScreenContainerComponent } from '../../../../../shared/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../../../../shared/components/screen-pad/screen-pad.component';
import { NavigationService } from '../../../../../shared/services/navigation/navigation.service';
import { ScreenService } from '../../../../screen.service';
import { ScreenServiceStub } from '../../../../screen.service.stub';
import { ConfirmMarriageInfoInterface } from '../models/confirm-marriage-info.interface';
import { TimerPipe } from '../pipes/timer.pipe';
import { ConfirmMarriageComponent } from './confirm-marriage.component';
import { TimerComponent } from './timer/timer.component';
import { DeviceDetectorService } from '../../../../../shared/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../../shared/services/device-detector/device-detector.service.stub';


describe('ConfirmMarriageComponent', () => {
  let component: ConfirmMarriageComponent;
  let fixture: ComponentFixture<ConfirmMarriageComponent>;
  let navigationService: NavigationService;
  let screenService: ScreenService;

  const mockComponentValue: ConfirmMarriageInfoInterface = {
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
        ConfirmMarriageComponent,
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
    fixture = TestBed.createComponent(ConfirmMarriageComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
