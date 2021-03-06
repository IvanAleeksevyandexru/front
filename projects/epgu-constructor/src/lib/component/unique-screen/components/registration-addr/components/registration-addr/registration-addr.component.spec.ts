import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockModule, MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  ScreenPadModule,
  ConfigService,
  ConfigServiceStub,
  LoggerService,
  LoggerServiceStub,
  EventBusService,
  ActivatedRouteStub,
  DatesToolsServiceStub,
  DatesToolsService,
} from '@epgu/epgu-constructor-ui-kit';
import { HttpClientModule } from '@angular/common/http';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { ConstructorPlainInputModule } from '../../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { FieldNames, IRegistrationAddrComponent } from '../../registration-addr-screen.types';
import { RegistrationAddrComponent } from './registration-addr.component';
import { ConstructorDadataWidgetModule } from '../../../../../../shared/components/constructor-dadata-widget/constructor-dadata-widget.module';
import { ConstructorDatePickerModule } from '../../../../../../shared/components/constructor-date-picker/constructor-date-picker.module';

import { DefaultUniqueScreenWrapperModule } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { UserInfoLoaderModule } from '../../../../../../shared/components/user-info-loader/user-info-loader.module';
import { SuggestHandlerService } from '../../../../../../shared/services/suggest-handler/suggest-handler.service';
import { SuggestMonitorService } from '../../../../../../shared/services/suggest-monitor/suggest-monitor.service';
import { ValidationService } from '../../../../../../shared/services/validation/validation.service';
import { UpdateOn } from '../../../../../custom-screen/components-list.types';

describe('RegistrationAddrComponent', () => {
  let component: RegistrationAddrComponent;
  let fixture: ComponentFixture<RegistrationAddrComponent>;
  let configService: ConfigService;
  let screenService: ScreenService;
  let datesToolsService: DatesToolsService;
  const mockData = ({
    id: 'pd5',
    type: 'RegistrationAddr',
    label: '',
    attrs: {
      separateProcessing: {
        type: 'toPdf',
        name: 'REG_ADDR_N_PERIOD',
      },
      hints: [
        {
          label: '??????????????',
          amount: 6,
          unit: 'months',
        },
      ],
      fields: [
        {
          fieldName: FieldNames.regAddr,
          label: '??????????',
          type: 'input',
          updateOnValidation: UpdateOn.ON_SUBMIT,
        },
        {
          fieldName: FieldNames.regDate,
          label: '?????????????????????? ????',
          type: 'input',
          minDate: 'today',
        },
      ],
      actions: [],
      refs: {},
    },
    linkedValues: [],
    arguments: {},
    value: '',
    required: true,
  } as unknown) as IRegistrationAddrComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationAddrComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MockModule(ConstructorPlainInputModule),
        MockModule(ConstructorDadataWidgetModule),
        MockModule(ConstructorDatePickerModule),
        MockModule(DefaultUniqueScreenWrapperModule),
        MockModule(BaseComponentsModule),
        MockModule(ScreenPadModule),
        MockModule(UserInfoLoaderModule),
        HttpClientModule,
      ],
      providers: [
        FormBuilder,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        MockProvider(CurrentAnswersService),
        MockProvider(SuggestHandlerService),
        MockProvider(EventBusService),
        MockProvider(SuggestMonitorService),
        MockProvider(ValidationService),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    configService = TestBed.inject(ConfigService);
    screenService = TestBed.inject(ScreenService);
    datesToolsService = TestBed.inject(DatesToolsService);
    fixture = TestBed.createComponent(RegistrationAddrComponent);
    screenService.component = mockData;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initFormGroup', () => {
    it('should create form without initial data', () => {
      component.initFormGroup(mockData);
      expect(component.redAddrForm.value).toEqual({
        regAddr: null,
        regDate: null,
      });
    });

    it('should create form with initial data', () => {
      const initData = {
        ...mockData,
        value: JSON.stringify({
          regAddr: {
            fullAddress: '129090, ??. ????????????, ????-????. ????????, ??. 22, ????. 1',
          },
          regDate: '2021-09-19T10:21:36.575Z',
        }),
      };
      component.initFormGroup(initData);
      expect(component.redAddrForm.value).toEqual({
        regAddr: '129090, ??. ????????????, ????-????. ????????, ??. 22, ????. 1',
        regDate: new Date('2021-09-19T10:21:36.575Z'),
      });
    });

    it('should reset invalid initial date', () => {
      const mockTestForValidation = JSON.parse(JSON.stringify(mockData));
      mockTestForValidation.attrs.fields[1].type = 'date';
      const initData = {
        ...mockTestForValidation,
        value: JSON.stringify({
          regAddr: {
            fullAddress: '129090, ??. ????????????, ????-????. ????????, ??. 22, ????. 1',
          },
          regDate: '2021-09-19T10:21:36.575Z',
        }),
      };
      jest
        .spyOn((component as any).validationService, 'dateValidator')
        .mockReturnValue(function (a, b) {
          return { msg: 'test' };
        });
      component.initFormGroup(initData);
      expect(component.redAddrForm.value).toEqual({
        regAddr: '129090, ??. ????????????, ????-????. ????????, ??. 22, ????. 1',
        regDate: null,
      });
    });

    it('should not reset valid initial date', () => {
      const mockTestForValidation = JSON.parse(JSON.stringify(mockData));
      mockTestForValidation.attrs.fields[1].type = 'date';
      const initData = {
        ...mockTestForValidation,
        value: JSON.stringify({
          regAddr: {
            fullAddress: '129090, ??. ????????????, ????-????. ????????, ??. 22, ????. 1',
          },
          regDate: '2021-09-19T10:21:36.575Z',
        }),
      };
      jest
        .spyOn((component as any).validationService, 'dateValidator')
        .mockReturnValue(function (a, b) {
          return false;
        });
      component.initFormGroup(initData);
      expect(component.redAddrForm.value).toEqual({
        regAddr: '129090, ??. ????????????, ????-????. ????????, ??. 22, ????. 1',
        regDate: new Date('2021-09-19T10:21:36.575Z'),
      });
    });
  });

  describe('hintClick', () => {
    it('should be create regDate', async () => {
      const mockDate = new Date('2021-05-19T09:19:08.327Z');
      const expectedDate = new Date('2021-11-18T09:19:08.327Z');
      // @ts-ignore
      const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      component.hintClick({ unit: 'months', amount: 6, label: '??????????????' });
      await waitForAsync(() => {
        expect(component.redAddrForm.value).toEqual({
          regAddr: null,
          regDate: expectedDate,
        });
      });
      spy.mockRestore();
    });
  });

  describe('subscribeToFormChanges', () => {
    it('should be set false in currentAnswersService.isValid', () => {
      component.redAddrForm.patchValue({});
      expect(component.currentAnswersService.isValid).toBeFalsy();
    });

    it('should be update currentAnswersService', () => {
      const date = new Date();
      const expectedDate = datesToolsService.format(date);
      component.redAddrForm.patchValue({
        regAddr: '129090, ??. ????????????, ????-????. ????????, ??. 22, ????. 1',
        regDate: date,
      });
      expect(component.currentAnswersService.isValid).toBeTruthy();
      expect(component.currentAnswersService.state).toEqual({
        regAddr: '129090, ??. ????????????, ????-????. ????????, ??. 22, ????. 1',
        regDate: expectedDate,
      });
    });
  });

  describe('subscribeToCmpErrors', () => {
    it('should create', () => {
      jest.spyOn(screenService, 'componentError$', 'get').mockReturnValue(of('error'));
      expect(screenService.componentError).toBeNull();
    });
  });
});
