import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import {
  UnsubscribeService,
  ConfigService,
  ConfigServiceStub, ScreenPadModule, LoggerService, LoggerServiceStub,
} from '@epgu/epgu-constructor-ui-kit';

import { ReferralNumberComponent, SearchReferralStatus } from './referral-number.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ReferralNumberService } from './referral-number.service';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { EpguLibModule } from '@epgu/epgu-lib';
import { LabelComponent } from '../../../../shared/components/base-components/label/label.component';
import { DefaultUniqueScreenWrapperComponent } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.component';
import { OutputHtmlComponent } from '../../../../shared/components/output-html/output-html.component';
import { ConstructorPlainInputComponent } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.component';
import { NavigationServiceStub } from '../../../../core/services/navigation/navigation.service.stub';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { IGetReferralResponseDto } from './referral-number-dto.interface';
import { ChangeDetectionStrategy } from '@angular/core';
import { Smev3ErrorMessagePipe } from '../../../../shared/pipes/smev-3-error-message/smev-3-error-message.pipe';

const mockComponent = {
  id: 'referralNumber',
  type: 'ReferralNumber',
  label: 'Поиск направления',
  arguments: {
    eserviceId: 'eserviceId',
    sessionId: 'sessionId',
  },
  linkedValues: [
    {
      argument: 'eserviceId',
      source: 'reg1.medicalInfo.eserviceId'
    },
    {
      argument: 'sessionId',
      source: 'reg1.medicalInfo.sessionId'
    }
  ],
  attrs: {},
  value: '',
  visited: false
};

const mockServiceResponseNotFound: IGetReferralResponseDto = {
  totalItems: null,
  items: [],
  version: null,
  error: {
    errorDetail: {
      errorCode: 6,
      errorMessage: 'NO_DATA:Направление пациента с указанным номером не найдено. Пожалуйста, проверьте корректность введенных выше данных.'
    },
    fieldErrors: []
  }
};

const mockServiceResponseExpired: IGetReferralResponseDto = {
  totalItems: 1,
  items: [
    {
      parentItem: null,
      children: [],
      fields: {
        itemName: null,
        title: null
      },
      attributes: [
        {
          name: 'referralId',
          value: '205206'
        },
        {
          name: 'referralNumber',
          value: '445'
        },
        {
          name: 'referralTypeId',
          value: '6'
        },
        {
          name: 'referralStartDate',
          value: '2020-01-10'
        },
        {
          name: 'referralEndDate',
          value: '2021-01-01'
        },
        {
          name: 'paymentSourceId',
          value: '1'
        },
        {
          name: 'toMoOid',
          value: '1.2.643.5.1.13.13.12.2.16.1179.0.221506'
        },
        {
          name: 'toMoName',
          value: 'Женская консультация, ГАУЗ "Городская поликлиника № 21"'
        },
        {
          name: 'toSpecsId',
          value: '34'
        },
        {
          name: 'toSpecsName',
          value: 'врач-кардиолог'
        },
        {
          name: 'toResourceName',
          value: 'Пушкина Анна Ивановна'
        },
        {
          name: 'fromMoOid',
          value: '1.2.643.5.1.13.13.12.2.16.1080.0.368844'
        },
        {
          name: 'fromMoName',
          value: 'Отделение узких специалистов, ГАУЗ "Городская поликлиника №18"'
        },
        {
          name: 'fromSpecsId',
          value: '109'
        },
        {
          name: 'fromSpecsName',
          value: 'врач-терапевт'
        },
        {
          name: 'fromResourceName',
          value: 'Николаева Яна Семеновна'
        }
      ]
    }
  ],
  version: null,
  error: {
    errorDetail: {
      errorCode: 0,
      errorMessage: 'Operation completed'
    },
    fieldErrors: []
  }
};

const mockServiceResponseOk: IGetReferralResponseDto = mockServiceResponseExpired; // datesToolsService.isBefore will be mocked in tests

const mockServiceResponseManyItems: IGetReferralResponseDto = {
  totalItems: 1,
  items: [
    {
      parentItem: null,
      children: [],
      fields: {
        itemName: null,
        title: null
      },
      attributes: [
        {
          name: 'referralId',
          value: '205206'
        },
        {
          name: 'referralNumber',
          value: '445'
        },
        {
          name: 'referralTypeId',
          value: '6'
        },
        {
          name: 'referralStartDate',
          value: '2020-01-10'
        },
        {
          name: 'referralEndDate',
          value: '2020-01-01'
        },
        {
          name: 'paymentSourceId',
          value: '1'
        },
        {
          name: 'toMoOid',
          value: '1.2.643.5.1.13.13.12.2.16.1179.0.221506'
        },
        {
          name: 'toMoName',
          value: 'Женская консультация, ГАУЗ "Городская поликлиника № 21"'
        },
        {
          name: 'toSpecsId',
          value: '34'
        },
        {
          name: 'toSpecsName',
          value: 'врач-кардиолог'
        },
        {
          name: 'toResourceName',
          value: 'Пушкина Анна Ивановна'
        },
        {
          name: 'fromMoOid',
          value: '1.2.643.5.1.13.13.12.2.16.1080.0.368844'
        },
        {
          name: 'fromMoName',
          value: 'Отделение узких специалистов, ГАУЗ "Городская поликлиника №18"'
        },
        {
          name: 'fromSpecsId',
          value: '109'
        },
        {
          name: 'fromSpecsName',
          value: 'врач-терапевт'
        },
        {
          name: 'fromResourceName',
          value: 'Николаева Яна Семеновна'
        }
      ]
    },
    {
      parentItem: null,
      children: [],
      fields: {
        itemName: null,
        title: null
      },
      attributes: [
        {
          name: 'referralId',
          value: '205206'
        },
        {
          name: 'referralNumber',
          value: '445'
        },
        {
          name: 'referralTypeId',
          value: '6'
        },
        {
          name: 'referralStartDate',
          value: '2019-01-10'
        },
        {
          name: 'referralEndDate',
          value: '2021-01-01'
        },
        {
          name: 'paymentSourceId',
          value: '1'
        },
        {
          name: 'toMoOid',
          value: '1.2.643.5.1.13.13.12.2.16.1179.0.221506'
        },
        {
          name: 'toMoName',
          value: 'Женская консультация, ГАУЗ "Городская поликлиника № 21"'
        },
        {
          name: 'toSpecsId',
          value: '34'
        },
        {
          name: 'toSpecsName',
          value: 'врач-кардиолог'
        },
        {
          name: 'toResourceName',
          value: 'Пушкина Анна Ивановна'
        },
        {
          name: 'fromMoOid',
          value: '1.2.643.5.1.13.13.12.2.16.1080.0.368844'
        },
        {
          name: 'fromMoName',
          value: 'Отделение узких специалистов, ГАУЗ "Городская поликлиника №18"'
        },
        {
          name: 'fromSpecsId',
          value: '109'
        },
        {
          name: 'fromSpecsName',
          value: 'врач-терапевт'
        },
        {
          name: 'fromResourceName',
          value: 'Николаева Яна Семеновна'
        }
      ]
    }
  ],
  version: null,
  error: {
    errorDetail: {
      errorCode: 0,
      errorMessage: 'Operation completed'
    },
    fieldErrors: []
  }
};

describe('ReferralNumberComponent', () => {
  let component: ReferralNumberComponent;
  let fixture: ComponentFixture<ReferralNumberComponent>;
  let screenService: ScreenService;
  let datesToolsService: DatesToolsService;
  let referralNumberService: ReferralNumberService;
  let navigationService: NavigationService;
  const ERROR_MESSAGE_SELECTOR = '.referral-number__text .mt-8';
  const RESPONSE_ERROR_EXAMPLE = {
    errorCode: -1,
    errorMessage: 'Повторное направление можно получить у того же специалиста'
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReferralNumberComponent,
        MockComponent(LabelComponent),
        MockComponent(OutputHtmlComponent),
        MockComponent(ConstructorPlainInputComponent),
        MockComponent(DefaultUniqueScreenWrapperComponent),
        Smev3ErrorMessagePipe,
      ],
      imports: [
        MockModule(EpguLibModule),
        MockModule(ScreenPadModule),
      ],
      providers: [
        UnsubscribeService,
        MockProvider(CurrentAnswersService),
        MockProvider(ReferralNumberService),
        MockProvider(ValidationService),
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
      ],
    }).overrideComponent(ReferralNumberComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    referralNumberService = TestBed.inject(ReferralNumberService);
    navigationService = TestBed.inject(NavigationService);
    datesToolsService = TestBed.inject(DatesToolsService);
    fixture = TestBed.createComponent(ReferralNumberComponent);
    component = fixture.componentInstance;
    screenService.component = mockComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('goBack', () => {
    component.searchStatus = 'ERROR_RESPONSE' as SearchReferralStatus;
    component.goBack();
    expect(component.searchStatus).toEqual('WAIT_FOR_USER_INPUT' as SearchReferralStatus);
  });

  it('hasErrorStatus', () => {
    component.searchStatus = 'ERROR_RESPONSE' as SearchReferralStatus;
    expect(component.hasErrorStatus()).toBeTruthy();
    component.searchStatus = 'WAIT_FOR_USER_INPUT' as SearchReferralStatus;
    expect(component.hasErrorStatus()).toBeFalsy();
  });

  it('chooseDoctor', () => {
    const nextSpy = jest.spyOn(navigationService, 'next').mockReturnValue(undefined);

    component.responseError = null;
    component.chooseDoctor();

    expect(nextSpy).toHaveBeenCalledWith({
      payload: {
        referralNumber: {
          value: JSON.stringify(null),
          visited: true,
        },
      },
    });
  });

  describe('when in error state', () => {
    beforeEach(() => {
      component.searchStatus = 'ERROR_RESPONSE' as SearchReferralStatus;
      component.responseError = RESPONSE_ERROR_EXAMPLE;
      fixture.detectChanges();
    });

    it('should render error ', () => {
      const debugEl = fixture.debugElement;

      expect(debugEl).toBeTruthy();
      expect(debugEl.query(By.css(ERROR_MESSAGE_SELECTOR))?.nativeElement?.innerHTML).toBe(
        'Повторное направление можно получить у того же специалиста'
      );
    });

    it('should render two buttons', () => {
      const debugEl = fixture.debugElement;

      expect(debugEl).toBeTruthy();
      expect(debugEl.queryAll(By.css('lib-button')).length).toBe(2);
    });

    it('should render form when click on back button', () => {
      const debugEl = fixture.debugElement;

      expect(debugEl).toBeTruthy();

      debugEl.queryAll(By.css('lib-button'))[0].nativeElement.click();
      fixture.detectChanges();

      expect(component.hasErrorStatus()).toBeFalsy();
    });

    it('should render form when click on choose doctor button', () => {
      const nextSpy = jest.spyOn(navigationService, 'next').mockReturnValue(undefined);
      const debugEl = fixture.debugElement;

      expect(debugEl).toBeTruthy();

      debugEl.queryAll(By.css('lib-button'))[1].nativeElement.click();
      fixture.detectChanges();

      expect(nextSpy).toHaveBeenCalledWith({
        payload: {
          referralNumber: {
            value: JSON.stringify(RESPONSE_ERROR_EXAMPLE),
            visited: true,
          },
        },
      });
    });
  });

  describe('findReferral', () => {
    const setup = (mock: IGetReferralResponseDto) => {
      component.referral.setValue('445');
      return jest.spyOn(referralNumberService, 'getReferralSearch').mockReturnValue(of(mock));
    };

    it('should call getReferralSeatch from service', () => {
      const getReferralSearchSpy = setup(mockServiceResponseNotFound);

      component.findReferral();

      expect(getReferralSearchSpy).toHaveBeenCalledWith('445', 'sessionId', 'eserviceId');
    });

    it('should NOT set ERROR STATE and show error message from service when not found', fakeAsync(() => {
      setup(mockServiceResponseNotFound);

      component.findReferral();
      fixture.detectChanges();

      expect(component.searchStatus).toEqual('WAIT_FOR_USER_INPUT' as SearchReferralStatus);
    }));

    it('should set ERROR STATE and show expired error message when expired', () => {
      setup(mockServiceResponseExpired);
      const isBeforeSpy = jest.spyOn(datesToolsService, 'isBefore').mockReturnValue(true);

      component.findReferral();
      fixture.detectChanges();

      const debugEl = fixture.debugElement;

      expect(isBeforeSpy).toHaveBeenCalledTimes(1);
      expect(component.searchStatus).toEqual('ERROR_RESPONSE' as SearchReferralStatus);
      expect(component.responseError).toEqual({
        errorCode: -1,
        errorMessage: 'Повторное направление можно получить у того же специалиста'
      });
      expect(debugEl).toBeTruthy();
      expect(debugEl.query(By.css(ERROR_MESSAGE_SELECTOR))?.nativeElement?.innerHTML).toBe(
        'Повторное направление можно получить у того же специалиста'
      );
    });

    it('should navigate to next page with payload when found', () => {
      setup(mockServiceResponseOk);
      const isBeforeSpy = jest.spyOn(datesToolsService, 'isBefore').mockReturnValue(false);
      const nextSpy = jest.spyOn(navigationService, 'next').mockReturnValue(undefined);

      component.findReferral();

      expect(isBeforeSpy).toHaveBeenCalledTimes(1);
      expect(nextSpy).toHaveBeenCalledWith({
        payload: {
          referralNumber: {
            value: JSON.stringify('445'),
            visited: true,
          },
        },
      });
    });

    it('should set ERROR STATE and show error message when there is network error', fakeAsync(() => {
      jest.spyOn(referralNumberService, 'getReferralSearch').mockImplementation(() => {
        return throwError(new Error('network error'));
      });

      component.referral.setValue('445');
      component.findReferral();
      fixture.detectChanges();

      const debugEl = fixture.debugElement;

      expect(component.searchStatus).toEqual('ERROR_RESPONSE' as SearchReferralStatus);
      expect(debugEl).toBeTruthy();
      expect(debugEl.query(By.css(ERROR_MESSAGE_SELECTOR))?.nativeElement?.innerHTML).toBe( 'Ошибка загрузки данных' );
    }));

    it('should NOT set ERROR STATE and NOT show expired error message when at least one not expired', () => {
      setup(mockServiceResponseManyItems);

      jest.spyOn(datesToolsService, 'parse')
        .mockImplementation((date: string) => {
          const result = new Date();

          result.setFullYear(+date.substr(0, 4));
          result.setMonth(6);
          result.setDate(15);

          return result;
        });

      jest.spyOn(datesToolsService, 'isBefore')
        .mockImplementation((dateLeft: Date | number) => (dateLeft as Date).getFullYear() === 2021);
      const nextSpy = jest.spyOn(navigationService, 'next').mockReturnValue(undefined);

      component.findReferral();
      fixture.detectChanges();

      expect(nextSpy).toHaveBeenCalledWith({
        payload: {
          referralNumber: {
            value: JSON.stringify('445'),
            visited: true,
          },
        },
      });
    });
  });
});
