import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';
import { CertificateEaisdoComponent } from './certificate-eaisdo.component';
import {
  EventBusService,
  ImgPrefixerPipe,
  LoggerService,
  SafePipe,
  UnsubscribeService
} from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { CertificateEaisdoService } from '../../../../shared/services/certificate-eaisdo/certificate-eaisdo.service';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { ActionServiceStub } from '../../../../shared/directives/action/action.service.stub';
import { throwError } from 'rxjs/internal/observable/throwError';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ActionApiResponse, ActionType, DTOActionAction, EaisdoResponse } from '@epgu/epgu-constructor-types';

const mockComponent = {
  id: 'ecr1',
  type: 'CertificateEaisdo',
  label: 'Данные сертификата EaisdoCertificateRequest',
  arguments: {
    externalIntegration: 'certificateEaisdoRequest'
  },
  attrs: {
    wait: `<img src="https://gu-st.ru/portal-st/lib-assets/gif/throbber-hexagon.gif" class="wait"/>
      <h5 class="mb-12 text--center">Идёт поиск</h5>
      <p class="mt-24 text-color--text-helper text--center">Может занять несколько минут. Не закрывайте страницу</p>`,
    error: `<img src="https://gu-st.ru/portal-st/assets/icons/svg/stop.svg" class="error"/>
      <h5 class="mb-12 text--center">Не удалось получить данные</h5>
      <p class="mt-24 text-color--text-helper text--center">Попробуйте снова сейчас или зайдите позже</p>`,
    errorButton: 'Попробовать снова',
    orderId: '${orderId}'
  },
  linkedValues: [{
    argument: 'recipientRegAddress',
    source: 'c2'
  }, {
    argument: 'applicantData',
    source: 'pd1'
  }, {
    argument: 'applicantRegAddress',
    source: 'pd4'
  }, {
    argument: 'LastName',
    source: 'Шмокодявкин'
  }, {
    argument: 'FirstName',
    source: 'Кузьма'
  }, {
    argument: 'MiddleName',
    source: 'Антихович'
  }, {
    argument: 'BirthDate',
    source: '01.09.2005'
  }, {
    argument: 'SNILS',
    defaultValue: '010-000-309 26'
  }, {
    argument: 'GenderType',
    defaultValue: 'M'
  }, {
    argument: 'BirthCertificateSeries',
    defaultValue: 'XI-ФФ'
  }, {
    argument: 'BirthCertificateNumber',
    defaultValue: '123456'
  }, {
    argument: 'BirthCertificateAgency',
    defaultValue: 'ЗАГС'
  }, {
    argument: 'BirthCertificateIssueDate',
    defaultValue: '01.09.2005'
  }, {
    argument: 'isForeign',
    defaultValue: 'false'
  }, {
    argument: 'payment',
    source: 'pw1'
  }, {
    argument: 'applicantPhoneNumber',
    source: 'pd2'
  }, {
    argument: 'applicantEmail',
    source: 'pd3'
  }, {
    argument: 'municipalityCode',
    source: 'cc5a.value.program.fiasMunicipal'
  }, {
    argument: 'municipalityName',
    source: 'cc5a.value.program.municipalityName'
  }, {
    argument: 'regionCode',
    source: 'cc5a.value.program.fiasRegion'
  }, {
    argument: 'regionName',
    source: 'cc5a.value.program.regionName'
  }, {
    argument: 'timeout',
    defaultValue: '30'
  }, {
    argument: 'externalIntegration',
    defaultValue: 'certificateEaisdoRequest'
  }
  ],
  value: '',
  visited: false
};

const timeoutResponse = {
  responseData: {
    isTimeout: true,
  }
};

const okResponse = {
  responseData: {
    data: 'some data',
  }
};

const buttonMock = {
  action: DTOActionAction.externalIntegrationAction
};

describe('CertificateEaisdoComponent', () => {
  let component: CertificateEaisdoComponent;
  let actionService: ActionServiceStub;
  let formService: ComponentsListFormServiceStub;
  let loggerService: LoggerService;
  let eventBusService: EventBusService;
  let fixture: ComponentFixture<CertificateEaisdoComponent>;
  let control: FormControl;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        CertificateEaisdoComponent,
        MockComponent(ComponentItemComponent),
        SafePipe,
        MockPipe(ImgPrefixerPipe),
      ],
      imports: [FormsModule, ReactiveFormsModule, ],
      providers: [
        UnsubscribeService,
        MockProvider(LoggerService),
        MockProvider(CertificateEaisdoService),
        MockProvider(ChangeDetectorRef),
        EventBusService,
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
      ],
    }).overrideComponent(CertificateEaisdoComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  });

  beforeEach(() => {
    formService = TestBed.inject(ComponentsListFormService) as unknown as ComponentsListFormServiceStub;
    actionService = TestBed.inject(ActionService) as unknown as ActionServiceStub;
    loggerService = TestBed.inject(LoggerService);
    eventBusService = TestBed.inject(EventBusService);
    fixture = TestBed.createComponent(CertificateEaisdoComponent);
    component = fixture.componentInstance;
    control = new FormControl(mockComponent);
    formService.form = new FormArray([ control ]);
    component.componentIndex = 0;
    component.control = control;
    jest.spyOn(component.control, 'get').mockReturnValue({ setValue: jest.fn() } as unknown as AbstractControl);
  });

  const setup = (integrationResponse: Error | Object = okResponse) => {
    const emitChangesSpy = jest.spyOn(formService, 'emitChanges');
    const switchActionSpy = jest.spyOn(actionService, 'switchAction');
    const loggerSpy = jest.spyOn(loggerService, 'error');

    jest
      .spyOn(actionService, 'handleExternalIntegrationAction')
      .mockReturnValue(
        (integrationResponse.constructor.name === 'Error' ?
          throwError(integrationResponse) :
          of(integrationResponse)) as unknown as Observable<ActionApiResponse<EaisdoResponse>>
      );

    fixture.detectChanges();

    return { emitChangesSpy, switchActionSpy, loggerSpy };
  };

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  describe('when handleExternalIntegrationAction returns error', () => {
    it('should render error', () => {
      setup(new Error('responseError'));

      expect(component.outputHtml()).toBe(mockComponent.attrs.error);
    });

    it('should call logger error', () => {
      const { loggerSpy } = setup(new Error('responseError'));

      expect(loggerSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when handleExternalIntegrationAction returns timeout', () => {
    it('should render timeout (same error)', () => {
      setup(timeoutResponse);

      expect(component.outputHtml()).toBe(mockComponent.attrs.error);
    });
  });

  describe('when handleExternalIntegrationAction returns ok', () => {
    it('should not update html', () => {
      setup(okResponse);

      expect(component.outputHtml()).toBe(mockComponent.attrs.wait);
    });

    it('should call emitChanges to store it', () => {
      const { emitChangesSpy } = setup(okResponse);

      expect(emitChangesSpy).toHaveBeenCalledTimes(1);
    });

    it('should call next action', () => {
      const { switchActionSpy } = setup(okResponse);

      expect(switchActionSpy).toHaveBeenCalledTimes(1);
      expect(switchActionSpy).toHaveBeenCalledWith({
        label: 'nextStep',
        type: ActionType.nextStep,
        action: DTOActionAction.getNextStep,
      }, 'ecr1');
    });

    it('should NOT call logger error', () => {
      const { loggerSpy } = setup(okResponse);

      expect(loggerSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('when buttonClick emitted', () => {
    const setupSpies = () => {
      const externalIntegrationSpy = jest
        .spyOn(actionService, 'handleExternalIntegrationAction')
        .mockReturnValue(of(okResponse) as unknown as Observable<ActionApiResponse<EaisdoResponse>>);
      eventBusService.emit('screenButtonClicked', buttonMock);

      return { externalIntegrationSpy };
    };

    it('should try fetch certificate again', () => {
      const { externalIntegrationSpy } = setupSpies();

      fixture.detectChanges();

      expect(externalIntegrationSpy).toHaveBeenCalledTimes(1);
      expect(externalIntegrationSpy).toHaveBeenCalledWith({
         action: 'service/actions/externalIntegration',
         label: 'Попробовать снова',
         type: 'externalIntegration',
       }, 'ecr1');
    });
  });
});
