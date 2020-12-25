import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ButtonComponent, LoaderComponent } from 'epgu-lib';
import { RouterTestingModule } from '@angular/router/testing';

import { ScreenContainerComponent } from '../../../../../../shared/components/screen-container/screen-container.component';
import { PageNameComponent } from '../../../../../../shared/components/base/page-name/page-name.component';
import { NavigationComponent } from '../../../../../../shared/components/navigation/navigation.component';
import { NavigationService } from '../../../../../../core/services/navigation/navigation.service';
import { OutputHtmlComponent } from '../../../../../../core/components/output-html/output-html.component';

import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';

import { SafePipe } from '../../../../../../core/pipes/safe/safe.pipe';
import { SignatureApplicationData } from '../../models/application.interface';
import { UtilsService } from '../../../../../../core/services/utils/utils.service';
import {
  ApplicantAnswersDto,
  ComponentActionDto,
  ComponentAttrsDto,
  ComponentDto,
  DTOActionAction,
} from '../../../../../../form-player/services/form-player-api/form-player-api.types';

import { SignatureApplicationComponent } from '../signature-application/signature-application.component';
import { of } from 'rxjs';
import { ModalService } from '../../../../../../modal/modal.service';
import { ImgPrefixerPipe } from '../../../../../../core/pipes/img-prefixer/img-prefixer.pipe';
import { DeviceDetectorServiceStub } from '../../../../../../core/services/device-detector/device-detector.service.stub';
import { DeviceDetectorService } from '../../../../../../core/services/device-detector/device-detector.service';
import { ModalServiceStub } from '../../../../../../modal/modal.service.stub';
import { ConfigService } from '../../../../../../core/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/config/config.service.stub';
import { LocationService } from '../../../../../../core/services/location/location.service';
import { SignatureApplicationContainerComponent } from './signature-application-container.component';
import { LocalStorageService } from '../../../../../../core/services/local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../../../../../../core/services/local-storage/local-storage.service.stub';
import { LocationServiceStub } from '../../../../../../core/services/location/location.service.stub';

describe('SignatureApplicationContainerComponent', () => {
  let component: SignatureApplicationContainerComponent;
  let fixture: ComponentFixture<SignatureApplicationContainerComponent>;
  let screenService: ScreenService;
  let deviceDetectorService: DeviceDetectorService;
  let locationService: LocationService;
  const mockComponentValue: SignatureApplicationData = {
    fileAccessCodes: [],
    operationID: '',
    url: '',
    userId: 0,
  };

  const mockComponent: ComponentDto = {
    attrs: {
      image: { src: 'https://gu-st.ru/content/catalog/new/divorce_3_e-signature.svg' },
    } as ComponentAttrsDto,
    label: 'labelComponent',
    type: '',
    id: '12',
    value: '',
  };

  const applicantAnswersDto: ApplicantAnswersDto = {
    id: { value: '', visited: false },
  };
  const mockHeader = 'header';

  const mockActions: ComponentActionDto[] = [
    { label: 'ActionButton', value: 'ActionButton', action: DTOActionAction.getNextStep },
  ];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          SignatureApplicationComponent,
          SignatureApplicationContainerComponent,
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
          { provide: ScreenService, useClass: ScreenServiceStub },
          { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
          { provide: ModalService, useClass: ModalServiceStub },
          { provide: ConfigService, useClass: ConfigServiceStub },
          { provide: LocationService, useClass: LocationServiceStub },
          { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    locationService = TestBed.inject(LocationService);

    jest.spyOn(screenService, 'actions$', 'get').mockReturnValue(of(mockActions));
    jest.spyOn(screenService, 'header$', 'get').mockReturnValue(of(mockHeader));
    jest.spyOn(screenService, 'showNav$', 'get').mockReturnValue(of(true));
    jest.spyOn(screenService, 'component$', 'get').mockReturnValue(of(mockComponent));
    jest.spyOn(screenService, 'component', 'get').mockReturnValue(mockComponent);
    jest.spyOn(screenService, 'componentValue', 'get').mockReturnValue(mockComponentValue);
    jest.spyOn(screenService, 'applicantAnswers', 'get').mockReturnValue(applicantAnswersDto);
    jest.spyOn(locationService, 'getHref').mockReturnValue('');

    fixture = TestBed.createComponent(SignatureApplicationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
