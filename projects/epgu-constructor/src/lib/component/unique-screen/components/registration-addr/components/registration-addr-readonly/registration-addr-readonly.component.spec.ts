import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule, MockProviders } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';
import {
  ConfigService,
  ConfigServiceStub,
  DatesToolsService,
  HealthService,
  ImgPrefixerPipe,
  SafePipe,
  ScreenPadModule,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { RegistrationAddrReadonlyComponent } from './registration-addr-readonly.component';
import { DefaultUniqueScreenWrapperModule } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { IRegistrationAddrReadonlyComponent } from '../../registration-addr-screen.types';
import { ClickableLabelDirective } from '../../../../../../shared/directives/clickable-label/clickable-label.directive';
import { DisclaimerModule } from '../../../../../../shared/components/disclaimer/disclaimer.module';
import { ValidationService } from '../../../../../../shared/services/validation/validation.service';
import { DateRangeService } from '../../../../../../shared/services/date-range/date-range.service';
import { DateRestrictionsService } from '../../../../../../shared/services/date-restrictions/date-restrictions.service';
import { CookieService } from 'ngx-cookie-service';

describe('RegistrationAddrReadonlyComponent', () => {
  let component: RegistrationAddrReadonlyComponent;
  let fixture: ComponentFixture<RegistrationAddrReadonlyComponent>;
  let screenService: ScreenService;
  let answersService: CurrentAnswersService;
  const mockData = ({
    id: 'pd5',
    type: 'RegistrationAddrReadonly',
    label: '',
    attrs: {},
    linkedValues: [],
    arguments: {},
    value: '{"regAddr" : {"fullAddress": "7777"}}',
    required: true,
  } as unknown) as IRegistrationAddrReadonlyComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegistrationAddrReadonlyComponent,
        ClickableLabelDirective,
        SafePipe,
        ImgPrefixerPipe,
      ],
      imports: [
        MockModule(DefaultUniqueScreenWrapperModule),
        MockModule(ScreenPadModule),
        MockModule(DisclaimerModule),
      ],
      providers: [
        UnsubscribeService,
        CurrentAnswersService,
        ValidationService,
        MockProviders(
          DateRangeService,
          DateRestrictionsService,
          DatesToolsService,
          HealthService,
          CookieService,
        ),
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    fixture = TestBed.createComponent(RegistrationAddrReadonlyComponent);
    screenService.component = mockData;
    answersService = TestBed.inject(CurrentAnswersService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should write data to registrationAddress field', () => {
      component.ngOnInit();
      expect(component.parsedValue).toBeTruthy();
    });

    it('should be valid screen if full address is present', () => {
      component.ngOnInit();
      expect(answersService.isValid).toBeTruthy();
    });

    it('should be invalid screen if full address is present', () => {
      const invalidMock = JSON.parse(
        JSON.stringify(mockData),
      ) as IRegistrationAddrReadonlyComponent;
      invalidMock.value = '{"regAddr" : {"fullAddress": ""}}';
      screenService.component = invalidMock;

      component.ngOnInit();

      expect(answersService.isValid).toBeFalsy();
    });

    it('should take error from screen service', () => {
      jest.spyOn(screenService, 'getStore').mockImplementation((...args) => {
        return { errors: { pd5: 'testError' }};
      });

      component.ngOnInit();

      expect(component.error).toEqual('testError');
    });

    it('should validate using custom rules', () => {
      const validationMock = JSON.parse(
        JSON.stringify(mockData),
      ) as IRegistrationAddrReadonlyComponent;
      validationMock.attrs.validation = [
        {
          type: 'RegExp',
          value: 'testValue',
          ref: '',
          dataType: '',
          condition: '',
          errorMsg: 'testError2',
        },
      ];
      screenService.component = validationMock;

      component.ngOnInit();

      expect(component.error).toEqual('testError2');
    });
  });
});
