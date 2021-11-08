import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MockComponents, MockProvider } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';
import {
  ScreenPadComponent,
  ConfigService,
  ConfigServiceStub,
  LoggerService,
  LoggerServiceStub,
  LocationService,
  LocationServiceStub,
  UnsubscribeService,
  HelperTextComponent,
  ModalService,
  ActivatedRouteStub,
  BaseUiModule,
} from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { InvitationErrorComponent } from './invitation-error.component';
import { ScreenContainerComponent } from '@epgu/epgu-constructor-ui-kit';
import { PageNameComponent } from '../../../../shared/components/base-components/page-name/page-name.component';
import { OutputHtmlComponent } from '../../../../shared/components/output-html/output-html.component';
import { ConstructorPlainInputComponent } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.component';
import { LabelComponent } from '../../../../shared/components/base-components/label/label.component';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { ComponentBase } from '../../../../screen/screen.types';
import { CustomComponent } from '../../../custom-screen/components-list.types';
import { DateRestrictionsService } from '../../../../shared/services/date-restrictions/date-restrictions.service';
import { InvitationErrorService } from '../../invitation-error.service';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../../core/services/navigation/navigation.service.stub';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Answer, ApplicantAnswersDto } from '@epgu/epgu-constructor-types';

describe('InvitationErrorComponent', () => {
  let component: InvitationErrorComponent;
  let validationService: ValidationService;
  let invitationErrorService: InvitationErrorService;
  let fixture: ComponentFixture<InvitationErrorComponent>;
  const mockData = {
    label: '',
    attrs: {
      url: '',
      ref: 'testAnswerData',
    },
    id: '',
    type: '',
  } as ComponentBase;
  const snils = '000-000-000 01';
  const email = 'test@site.net';
  const orderId = 1;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        InvitationErrorComponent,
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
      imports: [BaseUiModule, FormsModule, HttpClientModule],
      providers: [
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        ValidationService,
        UnsubscribeService,
        CurrentAnswersService,
        DateRangeService,
        DatesToolsService,
        MockProvider(DateRestrictionsService),
        InvitationErrorService,
        ModalService,
        { provide: NavigationService, useClass: NavigationServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationErrorComponent);
    validationService = TestBed.inject(ValidationService);
    invitationErrorService = TestBed.inject(InvitationErrorService);
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

  it('should send email', () => {
    component.applicantAnswers = {
      testAnswerData: {
        visited: true,
        value: JSON.stringify({
          snils: snils,
        }),
      } as Answer,
    } as ApplicantAnswersDto;
    component.orderId = orderId;
    component.email.setValue(email);
    fixture.detectChanges();

    jest.spyOn(invitationErrorService, 'post');
    component.sendEmail();

    expect(invitationErrorService.post).toBeCalledWith(
      `/orders/${orderId}/invitations/inviteToSign/send`,
      [{ email: email, id: snils, type: 'SNILS' }],
      { ref: 'testAnswerData', url: '' },
    );
  });
});
