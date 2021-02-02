import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonComponent, LoaderComponent } from 'epgu-lib';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../core/services/config/config.service.stub';
import { DeviceDetectorService } from '../../../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../../core/services/device-detector/device-detector.service.stub';
import { EventBusService } from '../../../../../core/services/event-bus/event-bus.service';
import { LocationService } from '../../../../../core/services/location/location.service';
import { LocationServiceStub } from '../../../../../core/services/location/location.service.stub';
import { NavigationService } from '../../../../../core/services/navigation/navigation.service';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { DisplayDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { ModalService } from '../../../../../modal/modal.service';
import { ModalServiceStub } from '../../../../../modal/modal.service.stub';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { ScreenTypes } from '../../../../../screen/screen.types';
import { PageNameComponent } from '../../../../../shared/components/base-components/page-name/page-name.component';
import { NavigationComponent } from '../../../../../shared/components/navigation/navigation.component';
import { OutputHtmlComponent } from '../../../../../shared/components/output-html/output-html.component';
import { RadioTaxComponent } from '../../../../../shared/components/radio-tax/radio-tax.component';
import { ScreenContainerComponent } from '../../../../../shared/components/screen-container/screen-container.component';
import { ImgPrefixerPipe } from '../../../../../shared/pipes/img-prefixer/img-prefixer.pipe';
import { SafePipe } from '../../../../../shared/pipes/safe/safe.pipe';
import { UnusedPaymentInterface } from '../unused-payment.interface';
import { UnusedPaymentsComponent } from './unused-payments.component';
import { ClickableLabelModule } from '../../../../../shared/directives/clickable-label/clickable-label.module';

describe('UnusedPaymentsComponent', () => {
  let component: UnusedPaymentsComponent;
  let fixture: ComponentFixture<UnusedPaymentsComponent>;

  const paymentsDataMock: UnusedPaymentInterface[] = [
    { uin: '123', payDate: 123123, amount: 123, link: 'sdf' },
  ];
  const mockDisplayDto: DisplayDto = {
    components: [],
    header: '',
    id: '',
    terminal: false,
    type: ScreenTypes.UNIQUE,
    name: 'name',
    submitLabel: 'submitLabel',
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, ClickableLabelModule],
        declarations: [
          UnusedPaymentsComponent,
          ScreenContainerComponent,
          PageNameComponent,
          NavigationComponent,
          ButtonComponent,
          OutputHtmlComponent,
          SafePipe,
          LoaderComponent,
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
          EventBusService,
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UnusedPaymentsComponent);
    component = fixture.componentInstance;

    component.data = mockDisplayDto;
    component.paymentsData = paymentsDataMock;
    component.showNav = true;
    fixture.detectChanges();
  });

  it('check', () => {
    expect(component).toBeTruthy();
  });

  it('check showNav', () => {
    expect(fixture.debugElement.query(By.css('.screen-container-mt'))).toBeNull();
  });

  it('check data.name', () => {
    expect(fixture.debugElement.query(By.css('epgu-constructor-page-name'))).not.toBeNull();
  });

  it('check paymentsData', () => {
    expect(fixture.debugElement.query(By.css('.radio-list'))).not.toBeNull();
  });

  it('check submitLabel', () => {
    const div: HTMLDivElement = fixture.debugElement.query(By.css('.secondary-font')).nativeElement;
    expect(div.innerHTML).toEqual(mockDisplayDto.submitLabel);
  });
});
