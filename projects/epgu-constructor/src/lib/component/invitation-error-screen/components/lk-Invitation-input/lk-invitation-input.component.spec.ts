import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { MockComponents, MockModule } from 'ng-mocks';
import { EpguLibModule } from '@epgu/epgu-lib';
import {
  ScreenPadComponent,
  UnsubscribeService,
  ConfigService,
  ConfigServiceStub,
  LoggerService,
  LoggerServiceStub,
  HelperTextComponent, ModalService,
} from '@epgu/epgu-constructor-ui-kit';

import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { LkInvitationInputComponent } from './lk-invitation-input.component';
import { ScreenContainerComponent } from '../../../../shared/components/screen-container/screen-container.component';
import { PageNameComponent } from '../../../../shared/components/base-components/page-name/page-name.component';
import { OutputHtmlComponent } from '../../../../shared/components/output-html/output-html.component';
import { ConstructorPlainInputComponent } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.component';
import { LabelComponent } from '../../../../shared/components/base-components/label/label.component';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { ComponentBase } from '../../../../screen/screen.types';
import { CustomComponent } from '../../../custom-screen/components-list.types';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../../core/services/navigation/navigation.service.stub';
import { DateRestrictionsService } from '../../../../shared/services/date-restrictions/date-restrictions.service';
import { InvitationType } from './invitation-type';
import { InvitationErrorService } from '../../invitation-error.service';

class HTTPClientStub {
  public post(url: string, body: any | null, options: object) {
    return of({});
  }
}

xdescribe('LkInvitationInputComponent', () => {
  let component: LkInvitationInputComponent;
  let validationService: ValidationService;
  let fixture: ComponentFixture<LkInvitationInputComponent>;
  const mockData = {
    id: '',
    type: '',
    label: '',
    attrs: {
      gender: 'M',
      error: {
        label: '<p>Ошибка отправки</p><p>Ваше приглашение не было отправлено. Попробуйте позже</p>',
      },
      success: {
        label: '<p>Приглашение отправлено</p>',
      },
      helperText:
        'На указанный адрес электронной почты придет ссылка для регистрации на портале Госуслуг',
      label: 'Введите адрес электронной почты',
      sendEmailLabel: 'Отправить приглашение и вернуться к началу заполнения заявления',
      redirectLabel: 'Продолжить позже/Вернуться к заявлению',
    },
  } as ComponentBase;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        LkInvitationInputComponent,
        MockComponents(
          ScreenContainerComponent,
          PageNameComponent,
          ScreenPadComponent,
          OutputHtmlComponent,
          LabelComponent,
          ConstructorPlainInputComponent,
          HelperTextComponent,
        ),
      ],
      imports: [MockModule(EpguLibModule)],
      providers: [
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: HttpClient, useClass: HTTPClientStub },
        ValidationService,
        UnsubscribeService,
        CurrentAnswersService,
        DateRangeService,
        DatesToolsService,
        DateRestrictionsService,
        ModalService,
        InvitationErrorService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LkInvitationInputComponent);
    validationService = TestBed.inject(ValidationService);
    component = fixture.componentInstance;
    component.data = mockData;
    component.config = TestBed.inject(ConfigService);
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should set custom validator', () => {
      const form = component.email;
      spyOn(validationService, 'customValidator').and.callThrough();
      form.setValidators(validationService.customValidator(mockData as CustomComponent));
      expect(validationService.customValidator).toBeCalledWith(mockData as CustomComponent);
    });
  });

  describe('sendEmail()', () => {
    describe('when fio attr provided', () => {
      beforeEach(() => {
        mockData.attrs.fio = 'Лавров Александр Александрович';
      });

      afterEach(() => {
        delete mockData.attrs.fio;
      });
    });

    describe('when first, middle, last names attrs provided', () => {
      beforeEach(() => {
        mockData.attrs.firstName = 'Александр';
        mockData.attrs.lastName = 'Лавров';
        mockData.attrs.middleName = 'Сергеевич';
      });

      afterEach(() => {
        delete mockData.attrs.firstName;
        delete mockData.attrs.lastName;
        delete mockData.attrs.middleName;
      });
    });

    describe('when first, last names attrs provided', () => {
      beforeEach(() => {
        mockData.attrs.firstName = 'Александр';
        mockData.attrs.lastName = 'Пушкин';
      });

      afterEach(() => {
        delete mockData.attrs.firstName;
        delete mockData.attrs.lastName;
      });

      it('should set flag emailSent to true', () => {
        const http = TestBed.inject(HttpClient);
        const httpPostSpy = jest.spyOn(http, 'post').mockReturnValue(of({}));
        const { firstName, lastName } = mockData.attrs;
        const fio = `${lastName} ${firstName}`;

        component.sendEmail();
        fixture.detectChanges();
        expect(component['emailSent']).toBe(true);
        expect(httpPostSpy).toBeCalledWith(
          '/register/LK_INVITATION',
          {
            additionalParams: { fio, gnr: mockData.attrs.gender },
            invitedUserEmail: '',
          },
          { withCredentials: true },
        );
      });
    });

    describe('when templateId provided', () => {
      beforeEach(() => {
        mockData.attrs.fio = 'Лавров Александр Александрович';
        mockData.attrs.templateId = 'INVITATION_REGISTRY_ANY' as InvitationType;
      });

      afterEach(() => {
        delete mockData.attrs.templateId;
        delete mockData.attrs.fio;
      });

      it('should set flag emailSent to true', () => {
        const http = TestBed.inject(HttpClient);
        const httpPostSpy = jest.spyOn(http, 'post').mockReturnValue(of({}));
        const { fio } = mockData.attrs;

        component.sendEmail();
        fixture.detectChanges();
        expect(component['emailSent']).toBe(true);
        expect(httpPostSpy).toBeCalledWith(
          '/register/INVITATION_REGISTRY_ANY',
          {
            additionalParams: { fio, gnr: mockData.attrs.gender },
            invitedUserEmail: '',
          },
          { withCredentials: true },
        );
      });
    });
  });
});
