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
import { UtilsService } from '../../../../../../core/services/utils/utils.service';
import {
  ComponentActionDto,
  ComponentAttrsDto,
  ComponentDto,
  DTOActionAction,
} from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { SignatureApplicationComponent } from './signature-application.component';
import { of } from 'rxjs';
import { ModalService } from '../../../../../../modal/modal.service';
import { ImgPrefixerPipe } from '../../../../../../core/pipes/img-prefixer/img-prefixer.pipe';
import { DeviceDetectorServiceStub } from '../../../../../../core/services/device-detector/device-detector.service.stub';
import { DeviceDetectorService } from '../../../../../../core/services/device-detector/device-detector.service';
import { ModalServiceStub } from '../../../../../../modal/modal.service.stub';
import { ConfigService } from '../../../../../../core/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/config/config.service.stub';
import { By } from '@angular/platform-browser';
import { LocationService } from '../../../../../../core/services/location/location.service';
import { LocationServiceStub } from '../../../../../../core/services/location/location.service.stub';

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
          { provide: ScreenService, useClass: ScreenServiceStub },
          { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
          { provide: ModalService, useClass: ModalServiceStub },
          { provide: ConfigService, useClass: ConfigServiceStub },
          { provide: LocationService, useClass: LocationServiceStub },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureApplicationComponent);
    component = fixture.componentInstance;
    component.isLoading$ = of(false);
    component.actions$ = of(mockActions);
    component.component$ = of(mockComponent);
    component.header$ = of(mockHeader);
    component.showNav$ = of(true);
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
    const divButton: HTMLButtonElement = fixture.debugElement.query(By.css('.btn__submit button'))
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
    fixture.debugElement.query(By.css('.btn__submit'))?.nativeElement?.click();
  });
});
