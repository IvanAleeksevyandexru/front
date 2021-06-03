import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponents, MockModule } from 'ng-mocks';
import { EpguLibModule } from '@epgu/epgu-lib';
import { UnsubscribeService } from 'projects/epgu-constructor/src/app/core/services/unsubscribe/unsubscribe.service';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../core/services/config/config.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { InvitationErrorComponent } from './invitation-error.component';
import { ScreenContainerComponent } from '../../../../shared/components/screen-container/screen-container.component';
import { PageNameComponent } from '../../../../shared/components/base-components/page-name/page-name.component';
import { ScreenPadComponent } from '@epgu/epgu-constructor-ui-kit';
import { OutputHtmlComponent } from '../../../../shared/components/output-html/output-html.component';
import { ConstructorPlainInputComponent } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.component';
import { LabelComponent } from '../../../../shared/components/base-components/label/label.component';
import { HelperTextComponent } from '@epgu/epgu-constructor-ui-kit';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { LocationService, LocationServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LoggerServiceStub } from '../../../../core/services/logger/logger.service.stub';
import { ComponentBase } from '../../../../screen/screen.types';
import { CustomComponent } from '../../../custom-screen/components-list.types';
import { configureTestSuite } from 'ng-bullet';
import { DateRestrictionsService } from '../../../../shared/services/date-restrictions/date-restrictions.service';

describe('InvitationErrorComponent', () => {
  let component: InvitationErrorComponent;
  let validationService: ValidationService;
  let locationService: LocationService;
  let fixture: ComponentFixture<InvitationErrorComponent>;
  const mockData = { label: '', attrs: { url: '' }, id: '', type: '' } as ComponentBase;
  const mockAnswers = { d1: { visited: true, value: '010-732-732 01' }};

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
      imports: [MockModule(EpguLibModule)],
      providers: [
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        ValidationService,
        UnsubscribeService,
        CurrentAnswersService,
        DateRangeService,
        DatesToolsService,
        DateRestrictionsService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationErrorComponent);
    validationService = TestBed.inject(ValidationService);
    locationService = TestBed.inject(LocationService);
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

  describe('redirectToLK()', () => {
    it('should redirect to lk', () => {
      spyOn(locationService, 'href').and.callThrough();
      component.redirectToLK();
      expect(locationService.href).toBeCalledWith('');
    });
  });

  describe('sendEmail()', () => {
    it('should set flag emailSent to true', () => {
      component.data = mockData;
      component.applicantAnswers = mockAnswers;

      component['sendEmail']();
      fixture.detectChanges();
      expect(component['emailSent']).toBe(true);
    });
  });
});
