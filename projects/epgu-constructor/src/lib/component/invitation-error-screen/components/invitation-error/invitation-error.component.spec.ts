import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponents, MockModule } from 'ng-mocks';
import { EpguLibModule } from '@epgu/epgu-lib';
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

describe('InvitationErrorComponent', () => {
  let component: InvitationErrorComponent;
  let validationService: ValidationService;
  let locationService: LocationService;
  let fixture: ComponentFixture<InvitationErrorComponent>;
  const mockData = { label: '', attrs: { url: '' }, id: '', type: '' } as ComponentBase;
  const mockAnswers = {
    d1: {
      visited: true,
      value: '010-732-732 01',
    },
  };

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
        InvitationErrorService,
        ModalService,
        { provide: NavigationService, useClass: NavigationServiceStub },
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
});
