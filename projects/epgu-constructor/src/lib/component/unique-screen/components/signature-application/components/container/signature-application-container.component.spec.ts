import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import {
  ConfigService,
  ObjectHelperService,
  ConfigServiceStub,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  LocalStorageService,
  LocalStorageServiceStub,
  SafePipe,
  LocationService,
  LocationServiceStub,
  WINDOW_PROVIDERS,
  DownloadService,
  ModalService,
  ModalServiceStub,
  PrevButtonComponent,
  ScreenContainerComponent,
  ImgPrefixerPipe,
} from '@epgu/epgu-constructor-ui-kit';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentDto,
  ComponentAttrsDto,
  ApplicantAnswersDto,
  ComponentActionDto,
  DTOActionAction,
} from '@epgu/epgu-constructor-types';
import { MockComponent } from 'ng-mocks';
import { ButtonComponent, LoaderComponent } from '@epgu/ui/base';
import { NavigationService } from '../../../../../../core/services/navigation/navigation.service';

import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { PageNameComponent } from '../../../../../../shared/components/base-components/page-name/page-name.component';

import { OutputHtmlComponent } from '../../../../../../shared/components/output-html/output-html.component';

import { SignatureApplicationData } from '../../models/application.interface';
import { SignatureApplicationComponent } from '../signature-application/signature-application.component';
import { SignatureApplicationContainerComponent } from './signature-application-container.component';
import { ClickableLabelModule } from '../../../../../../shared/directives/clickable-label/clickable-label.module';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';

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
    alreadySigned: false,
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

  const mockActions: ComponentActionDto = {
    label: 'ActionButton',
    value: 'ActionButton',
    action: DTOActionAction.getNextStep,
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ClickableLabelModule],
      declarations: [
        SignatureApplicationComponent,
        SignatureApplicationContainerComponent,
        ScreenContainerComponent,
        PageNameComponent,
        MockComponent(PrevButtonComponent),
        ButtonComponent,
        LoaderComponent,
        OutputHtmlComponent,
        SafePipe,
        ImgPrefixerPipe,
      ],
      providers: [
        NavigationService,
        DownloadService,
        ObjectHelperService,
        WINDOW_PROVIDERS,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        CurrentAnswersService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    locationService = TestBed.inject(LocationService);

    jest.spyOn(screenService, 'button$', 'get').mockReturnValue(of(mockActions));
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
