import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from '@epgu/epgu-lib';
import { CoreModule } from '../../../../../../core/core.module';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { CoreUiModule, LocationService, WINDOW_PROVIDERS } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerApiService } from '../../../../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../../../../form-player/services/form-player-api/form-player-api.service.stub';
import { ModalModule } from '../../../../../../modal/modal.module';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { BaseModule } from '../../../../../../shared/base.module';
import { AnswerButtonModule } from '../../../../../../shared/components/answer-button/answer-button.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { ActionModule } from '../../../../../../shared/directives/action/action.module';
import { HtmlRemoverService } from '../../../../../../shared/services/html-remover/html-remover.service';
import { PaymentTypeSelectorComponent } from './payment-type-selector.component';
import { PaymentTypeSelectorInterface } from '../../payment-type-selector.types';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PaymentTypeSelectorButtonComponent } from '../payment-type-selector-button/payment-type-selector-button.component';
import { AutocompleteApiService } from '../../../../../../core/services/autocomplete/autocomplete-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { FormPlayerService } from '../../../../../../form-player/services/form-player/form-player.service';
import { FormPlayerServiceStub } from '../../../../../../form-player/services/form-player/form-player.service.stub';

describe('PaymentTypeSelectorComponent', () => {
  let component: PaymentTypeSelectorComponent;
  let fixture: ComponentFixture<PaymentTypeSelectorComponent>;

  const applicantTypeMock = 'success';
  const paymentTypeSelectorMock = {
    header: 'success',
    subHeader: 'success',
    srcImg: 'asset.jpg',
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
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentTypeSelectorComponent, PaymentTypeSelectorButtonComponent],
      imports: [
        ModalModule,
        BaseModule,
        CoreModule,
        CoreUiModule,
        RouterTestingModule,
        BaseComponentsModule,
        ScreenContainerModule,
        ScreenPadModule,
        AnswerButtonModule,
        ActionModule,
        HttpClientTestingModule,
      ],
      providers: [
        HealthService,
        DatePipe,
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
      ],
    })
      .overrideComponent(PaymentTypeSelectorComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTypeSelectorComponent);
    component = fixture.componentInstance;
    component.showNav = false;
    component.isErrorTemplate = false;
    component.applicantType = applicantTypeMock;
    component.paymentTypeSelector = paymentTypeSelectorMock as PaymentTypeSelectorInterface;
    fixture.detectChanges();
  });

  it('should view nav', () => {
    expect(fixture.debugElement.query(By.css('.screen-container-mt'))).not.toBeNull();
  });

  it('should view error', () => {
    component.isErrorTemplate = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('epgu-cf-ui-constructor-screen-pad'))).not.toBeNull();
  });

  it('should img', () => {
    expect(fixture.debugElement.query(By.css('.payment-type-selector__img > img'))).not.toBeNull();
  });

  it('should header', () => {
    expect(fixture.debugElement.query(By.css('.payment-type-selector__header'))).not.toBeNull();
  });

  it('should subeader', () => {
    expect(fixture.debugElement.query(By.css('.payment-type-selector__sub-header'))).not.toBeNull();
  });

  it('should body', () => {
    expect(
      fixture.debugElement.query(By.css('epgu-constructor-output-html[ng-reflect-html=test]')),
    ).not.toBeNull();
  });
});