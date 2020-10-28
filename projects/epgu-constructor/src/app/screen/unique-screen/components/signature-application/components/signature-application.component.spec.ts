import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ButtonComponent, LoaderComponent } from 'epgu-lib';
import { RouterTestingModule } from '@angular/router/testing';

import { SignatureApplicationComponent } from './signature-application.component';
import { ScreenContainerComponent } from '../../../../../shared/components/screen-container/screen-container.component';
import { PageNameComponent } from '../../../../../shared/components/base/page-name/page-name.component';
import { NavigationComponent } from '../../../../../shared/components/navigation/navigation.component';
import { NavigationService } from '../../../../../shared/services/navigation/navigation.service';
import { OutputHtmlComponent } from '../../../../../shared/components/output-html/output-html.component';
import { ConfigService } from '../../../../../config/config.service';
import { ScreenService } from '../../../../screen.service';
import { ScreenServiceStub } from '../../../../screen.service.stub';
import { ConfigServiceStub } from '../../../../../config/config.service.stub';
import { ImgPrefixerPipe } from 'projects/epgu-constructor/src/app/shared/pipes/img-prefixer/img-prefixer.pipe';
import { SafePipe } from '../../../../../shared/pipes/safe/safe.pipe';
import { SignatureApplicationData } from '../models/application.interface';
import { UtilsService } from '../../../../../shared/services/utils/utils.service';
import {
  ApplicantAnswersDto,
  ComponentDto,
} from '../../../../../services/form-player-api/form-player-api.types';
import { DeviceDetectorService } from '../../../../../shared/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../../shared/services/device-detector/device-detector.service.stub';

describe('SignatureApplicationComponent', () => {
  let component: SignatureApplicationComponent;
  let fixture: ComponentFixture<SignatureApplicationComponent>;
  let navigationService: NavigationService;
  let screenService: ScreenService;
  let utilsService: UtilsService;

  const mockComponentValue: SignatureApplicationData = {
    fileAccessCodes: [],
    operationID: '',
    url: '',
    userId: 0,
  };

  const mockComponent: ComponentDto = {
    attrs: {},
    label: '',
    type: '',
    id: '12',
    value: '',
  };

  const applicantAnswersDto: ApplicantAnswersDto = {
    id: { value: '', visited: false },
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          SignatureApplicationComponent,
          ScreenContainerComponent,
          PageNameComponent,
          NavigationComponent,
          ButtonComponent,
          LoaderComponent,
          OutputHtmlComponent,
          SafePipe,
          ImgPrefixerPipe,
        ],
        providers: [
          NavigationService,
          UtilsService,
          { provide: ConfigService, useClass: ConfigServiceStub },
          { provide: ScreenService, useClass: ScreenServiceStub },
          { provide: ConfigService, useClass: ConfigServiceStub },
          { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        ],
      }).compileComponents();

      navigationService = TestBed.inject(NavigationService);
      screenService = TestBed.inject(ScreenService);
      utilsService = TestBed.inject(UtilsService);

      jest.spyOn(screenService, 'componentValue', 'get').mockReturnValue(mockComponentValue);
      jest.spyOn(screenService, 'component', 'get').mockReturnValue(mockComponent);
      jest.spyOn(screenService, 'applicantAnswers', 'get').mockReturnValue(applicantAnswersDto);
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureApplicationComponent);
    component = fixture.componentInstance;

    fixture.debugElement.injector.get(ScreenService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
