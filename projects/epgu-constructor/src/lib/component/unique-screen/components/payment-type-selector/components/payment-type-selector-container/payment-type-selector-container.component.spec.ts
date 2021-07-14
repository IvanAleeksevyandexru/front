import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CoreModule } from '../../../../../../core/core.module';
import { CoreUiModule, LocationService, WINDOW_PROVIDERS } from '@epgu/epgu-constructor-ui-kit';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerApiService } from '../../../../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../../../../form-player/services/form-player-api/form-player-api.service.stub';
import { ModalModule } from '../../../../../../modal/modal.module';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { BaseModule } from '../../../../../../shared/base.module';
import { AnswerButtonModule } from '../../../../../../shared/components/answer-button/answer-button.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { ActionModule } from '../../../../../../shared/directives/action/action.module';
import { HtmlRemoverService } from '../../../../../../shared/services/html-remover/html-remover.service';
import { PaymentTypeSelectorContainerComponent } from './payment-type-selector-container.component';
import { PaymentTypeSelectorComponent } from '../payment-type-selector/payment-type-selector.component';
import { PaymentTypeSelectorButtonComponent } from '../payment-type-selector-button/payment-type-selector-button.component';
import { AutocompleteApiService } from '../../../../../../core/services/autocomplete/autocomplete-api.service';
import { configureTestSuite } from 'ng-bullet';
import { FormPlayerServiceStub } from '../../../../../../form-player/services/form-player/form-player.service.stub';
import { FormPlayerService } from '../../../../../../form-player/services/form-player/form-player.service';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { MockModule } from 'ng-mocks';
import { EaisdoGroupCostService } from '../../../../../../shared/services/eaisdo-group-cost/eaisdo-group-cost.service';

describe('PaymentTypeSelectorContainerComponent', () => {
  let component: PaymentTypeSelectorContainerComponent;
  let fixture: ComponentFixture<PaymentTypeSelectorContainerComponent>;
  let screenService: ScreenService;
  const mockComponent = {
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
              value: 'На портале со скидкой 30%',
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
  } as ComponentDto;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PaymentTypeSelectorContainerComponent,
        PaymentTypeSelectorComponent,
        PaymentTypeSelectorButtonComponent,
      ],
      imports: [
        ModalModule,
        BaseModule,
        CoreModule,
        MockModule(CoreUiModule),
        RouterTestingModule,
        BaseComponentsModule,
        ScreenContainerModule,
        ScreenPadModule,
        AnswerButtonModule,
        ActionModule,
      ],
      providers: [
        LocationService,
        WINDOW_PROVIDERS,
        HtmlRemoverService,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        CurrentAnswersService,
        AutocompleteApiService,
        EaisdoGroupCostService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockComponent;
    fixture = TestBed.createComponent(PaymentTypeSelectorContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be init data', () => {
    component.init$.subscribe((value) => {
      expect(value).toEqual({
        applicantType: 'success',
        isErrorTemplate: true,
        paymentTypeSelector: {
          actions: [
            {
              action: 'getNextScreen',
              label: 'На портале со скидкой 30%',
              type: 'nextStep',
              value: 'На портале со скидкой 30%',
            },
          ],
          body: 'test',
          clarifications: {
            registration: {
              text: '<p>Регистрации подлежат:</p>',
              title: '',
            },
          },
          header: 'success',
          imgSrc: 'asset',
          subHeader: 'success',
        },
      });
    });
  });
});
