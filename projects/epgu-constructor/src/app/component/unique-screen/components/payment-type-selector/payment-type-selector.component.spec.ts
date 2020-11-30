import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '../../../../core/core.module';
import { DeviceDetectorService } from '../../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../core/services/device-detector/device-detector.service.stub';
import { FormPlayerApiService } from '../../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../../form-player/services/form-player-api/form-player-api.service.stub';
import { ComponentDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ModalModule } from '../../../../modal/modal.module';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { SharedModule } from '../../../../shared/shared.module';
import { PaymentTypeSelectorComponent } from './payment-type-selector.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';


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
      imports: [SharedModule, ModalModule, CoreModule, RouterTestingModule],
      providers: [
        HealthService,
        DatePipe,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
      ],
    }).compileComponents();

    screenService = TestBed.inject(ScreenService);

    jest.spyOn(screenService, 'component', 'get').mockReturnValue(mockComponent);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
