import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { MockComponents } from 'ng-mocks';
import {
  BaseUiModule,
  ConfigService,
  ConfigServiceStub,
  HelperTextComponent,
  ScreenContainerComponent,
  ScreenPadComponent,
} from '@epgu/epgu-constructor-ui-kit';

import { ConstructorPlainInputComponent } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.component';
import { ComponentBase } from '../../../../screen/screen.types';
import { CustomComponent } from '../../../custom-screen/components-list.types';
import { InvitationComponent } from './invitation.component';
import { InvitationTypes } from '../../invitation.types';
import { InvitationService } from '../../invitation.service';
import { InvitationServiceStub } from '../../invitation.service.stub';
import { InvitationType } from './invitation-type';
import { LabelComponent } from '../../../../shared/components/base-components/label/label.component';
import { OutputHtmlComponent } from '../../../../shared/components/output-html/output-html.component';
import { PageNameComponent } from '../../../../shared/components/base-components/page-name/page-name.component';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { ValidationServiceStub } from '../../../../shared/services/validation/validation.service.stub';

class HTTPClientStub {
  public post(url: string, body: any | null, options: object) {
    return of({});
  }
}

describe('InvitationComponent', () => {
  let component: InvitationComponent;
  let fixture: ComponentFixture<InvitationComponent>;

  let httpClient: HttpClient;
  let validationService: ValidationService;

  const mockOrderId = 987654321;
  const mockTemplateId = '123456789';
  const mockRef = 'abc123';
  const mockApplicantAnswer = {
    [mockRef]: {
      visited: true,
      value: JSON.stringify({
        snils: '12345',
      }),
    },
  };
  const mockFullName = {
    fio: 'Иванов Иван Иванович',
    firstName: 'Иван',
    lastName: 'Иванов',
    middleName: 'Иванович',
  };

  const mockData = {
    id: '',
    type: '',
    label: '',
    attrs: {
      error: {
        label: '<p>Ошибка отправки</p><p>Ваше приглашение не было отправлено. Попробуйте позже</p>',
      },
      firstName: 'FirstName',
      gender: 'M',
      helperText:
        'На указанный адрес электронной почты придет ссылка для регистрации на портале Госуслуг',
      label: 'Введите адрес электронной почты',
      lastName: 'LastName',
      redirectLabel: 'Продолжить позже/Вернуться к заявлению',
      ref: mockRef,
      sendEmailLabel: 'Отправить приглашение и вернуться к началу заполнения заявления',
      success: {
        label: '<p>Приглашение отправлено</p>',
      },
      templateId: mockTemplateId,
    },
  } as ComponentBase;

  let InvitationErrorPath: string;
  let LkInvitationInputPathWithTemplateId: string;
  let LkInvitationInputPathWithoutTemplateId: string;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        InvitationComponent,
        MockComponents(
          ConstructorPlainInputComponent,
          HelperTextComponent,
          LabelComponent,
          OutputHtmlComponent,
          PageNameComponent,
          ScreenContainerComponent,
          ScreenPadComponent,
        ),
      ],
      imports: [
        BaseUiModule,
        FormsModule
      ],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: InvitationService, useClass: InvitationServiceStub },
        { provide: HttpClient, useClass: HTTPClientStub },
        { provide: ValidationService, useClass: ValidationServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationComponent);

    httpClient = TestBed.inject(HttpClient);
    validationService = TestBed.inject(ValidationService);

    component = fixture.componentInstance;
    component.applicantAnswers = mockApplicantAnswer;
    component.componentType = InvitationTypes.invitationError;
    component.data = mockData;
    component.orderId = mockOrderId;
    component.config = TestBed.inject(ConfigService);
    fixture.detectChanges();

    InvitationErrorPath = `${component['urlPrefix']}/orders/${mockOrderId}/invitations/inviteToSign/send`;
    LkInvitationInputPathWithTemplateId = `${component['urlPrefix']}/register/${component.data.attrs.templateId}`;
    LkInvitationInputPathWithoutTemplateId = `${component['urlPrefix']}/register/${InvitationType.LK_INVITATION}`;
  });

  describe('ngOnInit()', () => {
    it('should set custom validator', () => {
      const spy = spyOn(validationService, 'customValidator').and.callThrough();
      component.ngOnInit();

      expect(spy).toBeCalledWith(mockData as CustomComponent);
    });

    it('should set urlPrefix with mockUrl', () => {
      expect(component['urlPrefix']).toBeFalsy();
      component.config.mocks.push('payment');
      component.ngOnInit();

      expect(component['urlPrefix']).toEqual(`${component.config.mockUrl}/lk/v1`);
    });

    it('should set urlPrefix with invitationUrl', () => {
      expect(component['urlPrefix']).toBeFalsy();
      component.ngOnInit();

      expect(component['urlPrefix']).toEqual(`${component.config.invitationUrl}`);
    });
  });

  describe('sendEmail()', () => {
    it('should call with invitationError type', () => {
      const httpPostSpy = jest.spyOn(httpClient, 'post').mockReturnValue(of({}));

      const ref = component.data.attrs?.ref as string;
      const value = component.applicantAnswers[ref]?.value;

      component.componentType = InvitationTypes.invitationError;
      component.ngOnInit();

      fixture.detectChanges();
      component.sendEmail();

      expect(httpPostSpy).toBeCalledWith(
        `${component['urlPrefix']}/orders/${component.orderId}/invitations/inviteToSign/send`,
        [
          {
            type: 'SNILS',
            id: JSON.parse(value).snils,
            email: component.email.value,
          }
        ],
        {
          withCredentials: true
        },
      );
    });

    it('should call with lkInvitationInput type', () => {
      const httpPostSpy = jest.spyOn(httpClient, 'post').mockReturnValue(of({}));
      const { firstName, lastName } = mockData.attrs;
      const fio = `${lastName} ${firstName}`;
      component.componentType = InvitationTypes.lkInvitationInput;
      component.ngOnInit();

      fixture.detectChanges();
      component.sendEmail();

      expect(httpPostSpy).toBeCalledWith(
        `${component['urlPrefix']}/register/${component.data.attrs.templateId}`,
        {
          additionalParams: { fio, gnr: mockData.attrs.gender },
          invitedUserEmail: '',
        },
        {
          withCredentials: true
        },
      );

      delete component.data.attrs.gender;
      fixture.detectChanges();
      component.sendEmail();

      expect(httpPostSpy).toBeCalledWith(
        `${component['urlPrefix']}/register/${component.data.attrs.templateId}`,
        {
          additionalParams: { fio },
          invitedUserEmail: '',
        },
        {
          withCredentials: true
        },
      );
    });
  });

  describe('path getter', () => {
    it('should return invitationError path', () => {
      component.componentType = InvitationTypes.invitationError;
      fixture.detectChanges();

      expect(component['path']).toEqual(InvitationErrorPath);
    });

    it('should return lkInvitationInput path with templateId', () => {
      component.componentType = InvitationTypes.lkInvitationInput;
      fixture.detectChanges();

      expect(component['path']).toEqual(LkInvitationInputPathWithTemplateId);
    });

    it('should return lkInvitationInput path without templateId', () => {
      component.componentType = InvitationTypes.lkInvitationInput;
      delete component.data.attrs.templateId;
      fixture.detectChanges();

      expect(component['path']).toEqual(LkInvitationInputPathWithoutTemplateId);
    });
  });

  describe('getFullName()', () => {
    it('should return fio if there is in attrs', () => {
      component.data.attrs = Object.assign({}, component.data.attrs, { fio: mockFullName.fio });
      fixture.detectChanges();

      expect(component['fullName']).toEqual(mockFullName.fio);
    });

    it('should return composite full name if there is not fio in attrs', () => {
      component.data.attrs = Object.assign({}, component.data.attrs, mockFullName, { fio: null });
      fixture.detectChanges();

      const { firstName, lastName, middleName } = mockFullName;

      expect(component['fullName']).toEqual(`${lastName} ${firstName} ${middleName}`);
    });

    it('should not return full name if there is not any name data in attrs', () => {
      delete component.data.attrs.fio;
      delete component.data.attrs.firstName;
      delete component.data.attrs.lastName;
      delete component.data.attrs.middleName;
      fixture.detectChanges();

      expect(component['fullName']).toEqual('null null');
    });

    it('should return trimmed full name', () => {
      component.data.attrs = Object.assign({}, component.data.attrs, { fio: '  Иванов Иван Иванович  ' });
      fixture.detectChanges();

      expect(component['fullName']).toEqual(mockFullName.fio);
    });
  });
});
