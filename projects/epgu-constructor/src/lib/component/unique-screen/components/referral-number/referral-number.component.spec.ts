import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import {
  UnsubscribeService,
  ConfigService,
  ConfigServiceStub,
  ScreenPadModule,
  LoggerService,
  LoggerServiceStub,
  ModalService,
  ModalServiceStub,
  LocationService,
  LocationServiceStub,
} from '@epgu/epgu-constructor-ui-kit';

import { ReferralNumberComponent } from './referral-number.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
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

describe('ReferralNumberComponent', () => {
  let component: ReferralNumberComponent;
  let fixture: ComponentFixture<ReferralNumberComponent>;
  let screenService: ScreenService;
  let datesToolsService: DatesToolsService;
  let navigationService: NavigationService;
  let modalService: ModalService;


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
        MockProvider(ValidationService),
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
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
    modalService = TestBed.inject(ModalService);
    screenService = TestBed.inject(ScreenService);
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

  describe('navigateToNextStep', () => {
    it('should navigate to next page', () => {
      const nextSpy = jest.spyOn(navigationService, 'next').mockReturnValue(undefined);

      component.referral.setValue('445');
      component.navigateToNextStep(component.referral.value);
      fixture.detectChanges();

      expect(nextSpy).toHaveBeenCalledWith({
        payload: {
          referralNumber: {
            value: '445',
            visited: true,
          },
        },
      });
    });
  });
});
