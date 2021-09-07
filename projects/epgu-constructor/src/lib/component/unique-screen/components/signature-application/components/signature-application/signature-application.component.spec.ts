import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonComponent, LoaderComponent } from '@epgu/epgu-lib';
import { ConfigService, ObjectHelperService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { LocationService, LocationServiceStub, SafePipe } from '@epgu/epgu-constructor-ui-kit';
import { NavigationService } from '../../../../../../core/services/navigation/navigation.service';
import { DownloadService } from '@epgu/epgu-constructor-ui-kit';
import { ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { PageNameComponent } from '../../../../../../shared/components/base-components/page-name/page-name.component';
import { PrevButtonComponent } from '@epgu/epgu-constructor-ui-kit';
import { OutputHtmlComponent } from '../../../../../../shared/components/output-html/output-html.component';
import { ScreenContainerComponent } from '@epgu/epgu-constructor-ui-kit';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { ImgPrefixerPipe } from '@epgu/epgu-constructor-ui-kit';
import { SignatureApplicationComponent } from './signature-application.component';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ClickableLabelModule } from '../../../../../../shared/directives/clickable-label/clickable-label.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';
import {
  ComponentDto,
  ComponentAttrsDto,
  ComponentActionDto,
  DTOActionAction,
} from '@epgu/epgu-constructor-types';
import { HtmlSelectService } from '../../../../../../core/services/html-select/html-select.service';
import { JsonHelperService } from '../../../../../../core/services/json-helper/json-helper.service';
import { JsonHelperServiceStub } from '../../../../../../core/services/json-helper/json-helper.service.stub';

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

  const mockActions: ComponentActionDto = {
    label: 'ActionButton',
    value: 'ActionButton',
    action: DTOActionAction.getNextStep,
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ClickableLabelModule],
      declarations: [
        SignatureApplicationComponent,
        ScreenContainerComponent,
        PageNameComponent,
        PrevButtonComponent,
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
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: JsonHelperService, useClass: JsonHelperServiceStub },
        CurrentAnswersService,
        HtmlSelectService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureApplicationComponent);
    component = fixture.componentInstance;
    component.isLoading = false;
    component.button = mockActions;
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
    expect(divButton.innerHTML.indexOf(mockActions.label)).not.toBe(-1);
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
