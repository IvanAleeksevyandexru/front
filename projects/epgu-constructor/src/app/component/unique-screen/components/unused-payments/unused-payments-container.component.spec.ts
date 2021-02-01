import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonComponent, LoaderComponent } from 'epgu-lib';
import { of } from 'rxjs';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../core/services/config/config.service.stub';
import { DeviceDetectorService } from '../../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../core/services/device-detector/device-detector.service.stub';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { LocalStorageService } from '../../../../core/services/local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../../../../core/services/local-storage/local-storage.service.stub';
import { LocationService } from '../../../../core/services/location/location.service';
import { LocationServiceStub } from '../../../../core/services/location/location.service.stub';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LoggerServiceStub } from '../../../../core/services/logger/logger.service.stub';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import {
  ApplicantAnswersDto,
  ComponentAttrsDto,
  ComponentDto,
  DisplayDto,
} from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ModalService } from '../../../../modal/modal.service';
import { ModalServiceStub } from '../../../../modal/modal.service.stub';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ScreenTypes } from '../../../../screen/screen.types';
import { PageNameComponent } from '../../../../shared/components/base-components/page-name/page-name.component';
import { NavigationComponent } from '../../../../shared/components/navigation/navigation.component';
import { OutputHtmlComponent } from '../../../../shared/components/output-html/output-html.component';
import { RadioTaxComponent } from '../../../../shared/components/radio-tax/radio-tax.component';
import { ScreenContainerComponent } from '../../../../shared/components/screen-container/screen-container.component';
import { ImgPrefixerPipe } from '../../../../shared/pipes/img-prefixer/img-prefixer.pipe';
import { SafePipe } from '../../../../shared/pipes/safe/safe.pipe';
import { UnusedPaymentsComponent } from './component/unused-payments.component';
import { UnusedPaymentInterface } from './unused-payment.interface';
import { UnusedPaymentsContainerComponent } from './unused-payments-container.component';
import { UnusedPaymentsService } from './unused-payments.service';
import { UnusedPaymentsServiceStub } from './unused-payments.service.stub';
import { ClickableLabelModule } from '../../../../shared/directives/clickable-label/clickable-label.module';

describe('UnusedPaymentsContainerComponent', () => {
  let component: UnusedPaymentsContainerComponent;
  let fixture: ComponentFixture<UnusedPaymentsContainerComponent>;
  let screenService: ScreenService;
  let deviceDetectorService: DeviceDetectorService;
  let locationService: LocationService;
  let unusedPaymentsService: UnusedPaymentsService;
  let eventBusService: EventBusService;

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

  const paymentsDataMock: UnusedPaymentInterface[] = [
    { uin: '123', payDate: 123123, amount: 123, link: 'sdf' },
  ];
  const mockDisplayDto: DisplayDto = {
    components: [],
    header: '',
    id: '',
    terminal: false,
    type: ScreenTypes.COMPONENT,
    name: 'name',
    submitLabel: 'submitLabel',
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, ClickableLabelModule],
        declarations: [
          UnusedPaymentsComponent,
          UnusedPaymentsContainerComponent,
          ScreenContainerComponent,
          PageNameComponent,
          NavigationComponent,
          ButtonComponent,
          LoaderComponent,
          OutputHtmlComponent,
          SafePipe,
          ImgPrefixerPipe,
          RadioTaxComponent,
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
          { provide: UnusedPaymentsService, useClass: UnusedPaymentsServiceStub },
          { provide: LoggerService, useClass: LoggerServiceStub },
          EventBusService,
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    locationService = TestBed.inject(LocationService);
    unusedPaymentsService = TestBed.inject(UnusedPaymentsService);
    eventBusService = TestBed.inject(EventBusService);

    jest.spyOn(screenService, 'showNav$', 'get').mockReturnValue(of(true));
    jest.spyOn(screenService, 'component$', 'get').mockReturnValue(of(mockComponent));
    jest.spyOn(screenService, 'component', 'get').mockReturnValue(mockComponent);
    jest.spyOn(screenService, 'applicantAnswers', 'get').mockReturnValue(applicantAnswersDto);
    jest.spyOn(screenService, 'display$', 'get').mockReturnValue(of(mockDisplayDto));
    jest.spyOn(unusedPaymentsService, 'getListPaymentsInfo').mockReturnValue(of(paymentsDataMock));

    fixture = TestBed.createComponent(UnusedPaymentsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('check radioSelect', () => {
    spyOn(component, 'radioSelect').and.callThrough();
    fixture.debugElement.query(By.css('.radio-tax__container')).nativeElement.click();
    fixture.detectChanges();
    expect(component.radioSelect).toHaveBeenCalled();
  });

  it('check next', (done) => {
    eventBusService.on('nextStepEvent').subscribe((value: string) => {
      expect(JSON.parse(value).reusePaymentUin).toEqual(paymentsDataMock[0].uin);
      done();
    });
    fixture.debugElement.query(By.css('.submit-button')).nativeElement.click();
    fixture.detectChanges();
    component.next();
  });
});
