import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonComponent, LoaderComponent } from 'epgu-lib';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/services/config/config.service.stub';
import { DeviceDetectorService } from '../../../../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../../../core/services/device-detector/device-detector.service.stub';
import { LocationService } from '../../../../../../core/services/location/location.service';
import { LocationServiceStub } from '../../../../../../core/services/location/location.service.stub';
import { NavigationService } from '../../../../../../core/services/navigation/navigation.service';
import { UtilsService } from '../../../../../../core/services/utils/utils.service';
import {
  ComponentActionDto,
  ComponentAttrsDto,
  ComponentDto,
  DTOActionAction,
} from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { ModalService } from '../../../../../../modal/modal.service';
import { ModalServiceStub } from '../../../../../../modal/modal.service.stub';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { PageNameComponent } from '../../../../../../shared/components/base-components/page-name/page-name.component';
import { NavigationComponent } from '../../../../../../shared/components/navigation/navigation.component';
import { OutputHtmlComponent } from '../../../../../../shared/components/output-html/output-html.component';
import { ScreenContainerComponent } from '../../../../../../shared/components/screen-container/screen-container.component';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { ImgPrefixerPipe } from '../../../../../../shared/pipes/img-prefixer/img-prefixer.pipe';
import { SafePipe } from '../../../../../../shared/pipes/safe/safe.pipe';
import { SignatureApplicationComponent } from './signature-application.component';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ClickableLabelModule } from '../../../../../../shared/directives/clickable-label/clickable-label.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';

describe('SignatureApplicationComponent', () => {
  let component: SignatureApplicationComponent;
  let fixture: ComponentFixture<SignatureApplicationComponent>;

  const mockComponent: ComponentDto = {
    attrs: {
      image: { src: 'https://gu-st.ru/content/catalog/new/divorce_3_e-signature.svg' },
    } as ComponentAttrsDto,
    label: 'labelComponent',
    type: '',
    id: '12',
    value: '',
  };

  const mockHeader = 'header';

  const mockActions: ComponentActionDto[] = [
    { label: 'ActionButton', value: 'ActionButton', action: DTOActionAction.getNextStep },
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ClickableLabelModule],
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
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        CurrentAnswersService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureApplicationComponent);
    component = fixture.componentInstance;
    component.isLoading = false;
    component.buttons = mockActions;
    component.component = mockComponent;
    component.header = mockHeader;
    component.showNav = true;
    component.isMobile = true;

    fixture.detectChanges();
  });

  it('check mobile', () => {
    expect(fixture.debugElement.query(By.css('.screen-container-mt'))).not.toBeNull();
  });

  it('check header', () => {
    const h1: HTMLHeadingElement = fixture.debugElement.query(
      By.css('epgu-constructor-page-name h1'),
    )?.nativeElement;

    expect(h1.innerHTML).toBe(mockHeader);
  });

  it('check label button', () => {
    const divButton: HTMLButtonElement = fixture.debugElement.query(By.css('.submit-button button'))
      ?.nativeElement;
    expect(divButton.innerHTML.indexOf(mockActions[0].label)).not.toBe(-1);
  });

  it('check image src', () => {
    const imageElement: HTMLImageElement = fixture.debugElement.query(
      By.css('.application__center img'),
    )?.nativeElement;
    expect(imageElement.src).toBe(mockComponent.attrs.image.src);
  });

  it('check output next', (done) => {
    component.next.subscribe((v) => {
      expect(v).toBeUndefined();
      done();
    });
    fixture.debugElement.query(By.css('.submit-button'))?.nativeElement?.click();
  });
});
