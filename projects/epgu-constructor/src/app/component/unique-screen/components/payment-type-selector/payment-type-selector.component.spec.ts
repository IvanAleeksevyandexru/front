import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
import { CoreModule } from '../../../../core/core.module';
import { DeviceDetectorService } from '../../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../core/services/device-detector/device-detector.service.stub';
import { FormPlayerApiService } from '../../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../../form-player/services/form-player-api/form-player-api.service.stub';
import { ComponentDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ModalModule } from '../../../../modal/modal.module';
import { PaymentTypeSelectorComponent } from './payment-type-selector.component';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../core/services/config/config.service.stub';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { BaseModule } from '../../../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { AnswerButtonModule } from '../../../../shared/components/answer-button/answer-button.module';
import { ActionModule } from '../../../../shared/directives/action/action.module';
import { LocationService } from '../../../../core/services/location/location.service';
import { WINDOW_PROVIDERS } from '../../../../core/providers/window.provider';
import { HtmlRemoverService } from '../../../../shared/services/html-remover/html-remover.service';

describe('PaymentTypeSelectorComponent', () => {
  let component: PaymentTypeSelectorComponent;
  let fixture: ComponentFixture<PaymentTypeSelectorComponent>;
  let screenService: ScreenService;
  const mockComponent: ComponentDto = {
    attrs: {
      applicantType: 'success',
      state: 'success',
      states: {
        success: {
          header: 'success',
          subHeader: 'success',
          imgSrc: 'asset',
          body: 'test',
          clarifications: { registration: { title: '', text: '<p>Регистрации подлежат:</p>' }},
          actions: [
            {
              label: 'На портале со скидкой 30%',
              value: '"На портале со скидкой 30%',
              type: 'nextStep',
              action: 'getNextScreen',
            },
          ],
        },
      },
    },
    label: '',
    type: 'PaymentTypeSelector',
    id: '12',
    value: '',
    required: true,
    visited: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentTypeSelectorComponent],
      imports: [
        ModalModule,
        CoreModule,
        RouterTestingModule,
        BaseModule,
        ScreenContainerModule,
        ScreenPadModule,
        AnswerButtonModule,
        ActionModule,
      ],
      providers: [
        HealthService,
        DatePipe,
        LocationService,
        WINDOW_PROVIDERS,
        HtmlRemoverService,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockComponent;
    fixture = TestBed.createComponent(PaymentTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
