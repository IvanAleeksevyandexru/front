import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockModule } from 'ng-mocks';
import { of } from 'rxjs';

import { ConfigService } from '../../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/services/config/config.service.stub';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { ConstructorPlainInputModule } from '../../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { IRegistrationAddrComponent } from '../../registration-addr-screen.types';
import { RegistrationAddrComponent } from './registration-addr.component';
// eslint-disable-next-line max-len
import { ConstructorDadataWidgetModule } from '../../../../../../shared/components/constructor-dadata-widget/constructor-dadata-widget.module';
import { ConstructorDatePickerModule } from '../../../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { DateValidator } from './date-validator';
import { DefaultUniqueScreenWrapperModule } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';
import { UserInfoLoaderModule } from '../../../../../../shared/components/user-info-loader/user-info-loader.module';
import { LoggerService } from '../../../../../../core/services/logger/logger.service';
import { LoggerServiceStub } from '../../../../../../core/services/logger/logger.service.stub';

describe('RegistrationAddrComponent', () => {
  let component: RegistrationAddrComponent;
  let fixture: ComponentFixture<RegistrationAddrComponent>;
  let configService: ConfigService;
  let screenService: ScreenService;
  const mockData: IRegistrationAddrComponent = {
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
          label: 'Полгода',
          amount: 6,
          unit: 'months',
        },
      ],
      fields: [
        {
          fieldName: 'regAddr',
          label: 'Адрес',
          type: 'input',
          updateOnValidation: 'submit',
        },
        {
          fieldName: 'regDate',
          label: 'регистрация до',
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
  };

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
      ],
      providers: [
        UnsubscribeService,
        CurrentAnswersService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        DatesToolsService,
        DateValidator,
        { provide: LoggerService, useClass: LoggerServiceStub },
        FormBuilder,
      ],
    }).compileComponents();
    configService = TestBed.inject(ConfigService);
    screenService = TestBed.inject(ScreenService);
  });

  beforeEach(() => {
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
            fullAddress: '129090, г. Москва, пр-кт. Мира, д. 22, кв. 1',
          },
          regDate: '2021-09-19T10:21:36.575Z',
        }),
      };
      component.initFormGroup(initData);
      expect(component.redAddrForm.value).toEqual({
        regAddr: '129090, г. Москва, пр-кт. Мира, д. 22, кв. 1',
        regDate: new Date('2021-09-19T10:21:36.575Z'),
      });
    });
  });

  describe('hintClick', () => {
    it('should be create regDate', () => {
      const mockDate = new Date('2021-05-19T09:19:08.327Z');
      const expectedDate = new Date('2021-11-19T09:19:08.327Z');
      // @ts-ignore
      const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      component.hintClick({ unit: 'months', amount: 6, label: 'Полгода' });
      expect(component.redAddrForm.value).toEqual({
        regAddr: null,
        regDate: expectedDate,
      });
      spy.mockRestore();
    });
  });

  describe('subscribeToFormChanges', () => {
    it('should be set false in currentAnswersService.isValid', () => {
      component.redAddrForm.patchValue(null);
      expect(component.currentAnswersService.isValid).toBeFalsy();
    });

    it('should be update currentAnswersService', () => {
      const date = new Date();
      component.redAddrForm.patchValue({
        regAddr: '129090, г. Москва, пр-кт. Мира, д. 22, кв. 1',
        regDate: date,
      });
      expect(component.currentAnswersService.isValid).toBeTruthy();
      expect(component.currentAnswersService.state).toEqual({
        regAddr: '129090, г. Москва, пр-кт. Мира, д. 22, кв. 1',
        regDate: date,
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
